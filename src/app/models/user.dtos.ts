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