export interface LoginRequestDto {
  username: string;
  password: string;
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
  refreshToken: string;
}