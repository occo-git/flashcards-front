export interface LoginRequestDto {
  clientId: string;
  grantType: string;
  username: string | null;
  password: string | null;
}

export interface TokenResponseDto {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
}

export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequestDto {
  clientId: string;
  grantType: string;
  refreshToken: string;
}