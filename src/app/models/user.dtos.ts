export interface UserInfoDto {
  Id: string;
  username: string;
  email: string;
  level: string;
  provider: string;
}

export interface LevelRequestDto {
  level: string;
}

export interface UpdateUsernameDto {
  newUsername: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface DeleteProfileDto {
  password: string;
}

export interface ResetPasswordRequestDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  email: string;
  password: string;
}