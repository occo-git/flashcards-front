import { environment } from '@env/environment';

export interface ApiPaths {
  ROOT: string
  USERS: { 
    BY_ID: string
    REGISTER: string
    LOGIN: string
    REFRESH: string
    ME: string
    LOGOUT: string
  }
  CARDS: {
    DECK: string
    BY_ID: string
  }
  IMAGES: string
}

export const CONST_API_PATHS: ApiPaths = {
  ROOT: environment.apiUrl,
  USERS: {
    BY_ID: `${environment.apiUrl}users`,
    REGISTER: `${environment.apiUrl}users/register`,
    LOGIN: `${environment.apiUrl}users/login`,
    REFRESH: `${environment.apiUrl}users/refresh`,
    ME: `${environment.apiUrl}users/me`,
    LOGOUT: `${environment.apiUrl}users/logout`
  },
  CARDS: {
    BY_ID: `${environment.apiUrl}/cards`,
    DECK: `${environment.apiUrl}/cards/deck`
  },
  IMAGES: `${environment.apiUrl}/images`
};