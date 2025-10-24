import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenResponseDto, RefreshTokenRequestDto } from '@app/models/auth.dtos'
import { environment } from '@env/environment'

const urlRefresh: string = `${environment.apiUrl}/users/refresh`;

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  private CONST_SESSION_KEY = 'sessionId';
  private CONST_ACCESS_KEY = 'accessToken';
  private CONST_REFRESH_KEY = 'refreshToken';
  private CONST_BEFORE_EXPIRE_SEC: number = 60; // 1 min before expiration

  constructor(
        private httpClient: HttpClient
    ) { }

  //#region sessionId
  private saveSessionId(sessionId: string): void {
    const maxAgeSeconds = 30 * 24 * 60 * 60; // 30 дней
    this.setCookie(this.CONST_SESSION_KEY, sessionId, maxAgeSeconds);
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

  private isAccessTokenExpired(beforeDelay: number = 0): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const exp = this.getTokenExpirySeconds(token);
    if (!exp) return true;

    return Date.now() > (exp - beforeDelay) * 1000; // in ms
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
  private setCookie(name: string, value: string, maxAgeSeconds: number): void {
    if (maxAgeSeconds > 0)
      document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; Secure; SameSite=Strict`;
    else
      document.cookie = `${name}=''; max-age=-1; path=/; Secure; SameSite=Strict`;
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }
  //#endregion

  //#region headers
  getLoginHeaders(): HttpHeaders {
    return new HttpHeaders({
      [this.CONST_SESSION_KEY]: uuidv4() // new sessionId
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const sessionId = this.getSessionId();
    const accessToken = this.getAccessToken();

    const headers = new HttpHeaders({
      [this.CONST_SESSION_KEY]: sessionId ?? '',
      ['Authorization']: accessToken ? `Bearer ${accessToken}` : ''
    });
    return headers;
  }

  getHeaders(): Observable<HttpHeaders> {
    if (!this.isAccessTokenExpired(this.CONST_BEFORE_EXPIRE_SEC)) {
      return of(this.getAuthHeaders());
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clear();
      return throwError(() => new Error('No refresh token'));
    }

    const headers = this.getAuthHeaders();
    const request: RefreshTokenRequestDto = { refreshToken };

    return this.httpClient
      .post<TokenResponseDto>(urlRefresh, request, { headers: headers })
      .pipe(
        tap(response => this.saveLoginResponse(response)),
        map(() => this.getAuthHeaders()), // return HttpHeaders
        catchError(err => {
          this.clear();
          return throwError(() => err);
        })
      );
  }
  //#endregion

  saveLoginResponse(response: TokenResponseDto) {
    this.saveSessionId(response.sessionId);
    this.saveTokens(response.accessToken, response.refreshToken);
  }

  clear() {
    this.setCookie(this.CONST_SESSION_KEY, '', -1);
    this.setCookie(this.CONST_ACCESS_KEY, '', -1);
    this.setCookie(this.CONST_REFRESH_KEY, '', -1);
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const sessionId = this.getSessionId();

    // User is authenticated if accessToken exists, is not expired, and sessionId exists
    return !!accessToken && !this.isAccessTokenExpired() && !!sessionId;
  }
}