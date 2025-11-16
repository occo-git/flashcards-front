import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { TokenResponseDto, RefreshTokenRequestDto } from '@models/auth.dtos'
import { CONST_API_PATHS, SKIP_AUTH } from '@services/api.constants'

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private CONST_SESSION_KEY = 'sessionId';
  private CONST_ACCESS_KEY = 'accessToken';
  private CONST_REFRESH_KEY = 'refreshToken';
  private CONST_SESSION_EXPIRE_SEC = 30 * 24 * 60 * 60; // 30 days
  private CONST_TOKEN_BEFORE_EXPIRE_SEC: number = 60; // 1 min before expiration

  constructor(
    private httpClient: HttpClient
  ) { }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const sessionId = this.getSessionId();
    // User is authenticated if accessToken exists, is not expired, and sessionId exists
    return !!accessToken && !this.isAccessTokenExpired() && !!sessionId;
  }

  saveLoginResponse(response: TokenResponseDto) {
    this.saveSessionId(response.sessionId);
    this.saveTokens(response.accessToken, response.refreshToken);
  }

  //#region sessionId
  private saveSessionId(sessionId: string): void {
    this.setCookie(this.CONST_SESSION_KEY, sessionId, this.CONST_SESSION_EXPIRE_SEC);
  }

  private getSessionId(): string | null {
    return this.getCookie(this.CONST_SESSION_KEY);
  }
  //#endregion

  //#region tokens
  private saveTokens(accessToken: string, refreshToken: string): void {
    const accessExpSeconds = this.getTokenExpirySeconds(accessToken);
    const refreshExpSeconds = this.getTokenExpirySeconds(refreshToken);

    this.setCookie(this.CONST_ACCESS_KEY, accessToken, accessExpSeconds);
    this.setCookie(this.CONST_REFRESH_KEY, refreshToken, refreshExpSeconds);
  }

  private getAccessToken(): string | null {
    return this.getCookie(this.CONST_ACCESS_KEY);
  }

  public getRefreshToken(): string | null {
    return this.getCookie(this.CONST_REFRESH_KEY);
  }

  private isAccessTokenExpired(beforeSeconds: number = 0): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const exp = this.getTokenExpirySeconds(token);
    if (!exp) return true;

    return Date.now() > (exp - beforeSeconds) * 1000; // in ms
  }

  private getTokenExpirySeconds(token: string): number {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = atob(base64);
      const payload = JSON.parse(jsonPayload);
      return payload.exp ?? 0;
    } catch {
      return 0;
    }
  }
  //#endregion

  //#region cookies
  private setCookie(name: string, value: string = '', maxAgeSeconds: number = -1): void {
    document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; Secure; SameSite=Strict`;
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  clearCookies() {
    this.setCookie(this.CONST_SESSION_KEY);
    this.setCookie(this.CONST_ACCESS_KEY);
    this.setCookie(this.CONST_REFRESH_KEY);
  }
  //#endregion

  //#region headers
  getSessionHeaders(): HttpHeaders {
    return new HttpHeaders({
      [this.CONST_SESSION_KEY]: uuidv4() // new sessionId
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const sessionId = this.getSessionId();
    const accessToken = this.getAccessToken();

    return new HttpHeaders({
      [this.CONST_SESSION_KEY]: sessionId ?? '',
      ['Authorization']: accessToken ? `Bearer ${accessToken}` : ''
    });
  }

  getHeaders(): Observable<HttpHeaders> {
    if (!this.isAccessTokenExpired(this.CONST_TOKEN_BEFORE_EXPIRE_SEC)) {
      return of(this.getAuthHeaders());
    }

    // Token soon will be expired, try to refresh exiting token
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearCookies();
      return throwError(() => new Error('No refresh token'));
    }

    const headers = this.getAuthHeaders();
    const request: RefreshTokenRequestDto = { refreshToken };

    return this.httpClient
      .post<TokenResponseDto>(CONST_API_PATHS.AUTH.REFRESH, request,
        {
          headers: headers,
          context: new HttpContext().set(SKIP_AUTH, true) // skip interceptor
        })
      .pipe(
        tap(response => this.saveLoginResponse(response)),
        map(() => this.getAuthHeaders()), // return HttpHeaders
        catchError(err => {
          this.clearCookies();
          return throwError(() => err);
        })
      );
  }
  //#endregion
}