import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  private sessionIdKey = 'sessionId';
  private accessTokenCookie = 'accessToken';
  private refreshTokenCookie = 'refreshToken';

  constructor() {
    if (!this.getSessionId()) {
      this.setSessionId(uuidv4());
    }
  }

  private setSessionId(id: string): void {
    document.cookie = `${this.sessionIdKey}=${id}; path=/; Secure; SameSite=Strict`;
  }

  getSessionId(): string | null {
    return this.getCookie(this.sessionIdKey);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    const accessExpSeconds = this.getTokenExpirySeconds(accessToken);
    const refreshExpSeconds = this.getTokenExpirySeconds(refreshToken);

    this.setCookie(this.accessTokenCookie, accessToken, accessExpSeconds);
    this.setCookie(this.refreshTokenCookie, refreshToken, refreshExpSeconds);
  }

  getAccessToken(): string | null {
    return this.getCookie(this.accessTokenCookie);
  }

  getRefreshToken(): string | null {
    return this.getCookie(this.refreshTokenCookie);
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const exp = this.getTokenExp(token);
    if (!exp) return true;

    return Date.now() > exp * 1000; // in ms
  }

  private setCookie(name: string, value: string, maxAgeSeconds: number): void {
    const cookieStr = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; Secure; SameSite=Strict`;
    document.cookie = cookieStr;
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  private getTokenExpirySeconds(token: string): number {
    try {
      const exp = this.getTokenExp(token);
      if (!exp) return 0;

      const diffMillis = exp * 1000 - Date.now();

      return diffMillis > 0 ? diffMillis / 1000 : 0; // in seconds
    } catch {
      return 0;
    }
  }

  private getTokenExp(token: string): number | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = atob(base64);
      const payload = JSON.parse(jsonPayload);
      return payload.exp ?? null;
    } catch {
      return null;
    }
  }

  getAuthHeaders(): Headers {
    const headers = new Headers();
    const sessionId = this.getSessionId();
    const accessToken = this.getAccessToken();

    if (sessionId) {
      headers.append(this.sessionIdKey, sessionId);
    }
    if (accessToken) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  }
}