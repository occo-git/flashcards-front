export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  clientId: string;
  grantType: string;
  username: string;
  password: string;
}

export interface GoogleSingInRequestDto {
  clientId: string;
  grantType: string;
  idToken: string;
}

export interface TokenResponseDto {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
}

export interface RefreshTokenRequestDto {
  clientId: string;
  grantType: string;
  refreshToken: string;
}