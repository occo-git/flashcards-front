export interface LoginUserDto {
  username: string;
  password: string;
}

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UserInfoDto {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}