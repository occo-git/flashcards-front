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
    LEVEL: string
  }
  CARDS: {
    BY_ID: string
    CARD_FROM_DECK: string
    LEVELS: string
    THEMES: string
    DECK: string
    LIST: string
  }
  IMAGES: string
}

export const CONST_API_PATHS: ApiPaths = {
  ROOT: environment.apiUrl,
  USERS: {
    BY_ID: `${environment.apiUrl}/users`,
    REGISTER: `${environment.apiUrl}/users/register`,
    LOGIN: `${environment.apiUrl}/users/login`,
    REFRESH: `${environment.apiUrl}/users/refresh`,
    ME: `${environment.apiUrl}/users/me`,
    LOGOUT: `${environment.apiUrl}/users/logout`,
    LEVEL: `${environment.apiUrl}/users/level`
  },
  CARDS: {
    BY_ID: `${environment.apiUrl}/cards`,
    CARD_FROM_DECK: `${environment.apiUrl}/cards/card-from-deck`,
    LEVELS: `${environment.apiUrl}/cards/levels`, 
    THEMES: `${environment.apiUrl}/cards/themes`,
    DECK: `${environment.apiUrl}/cards/deck`,
    LIST: `${environment.apiUrl}/cards/list`
  },
  IMAGES: `${environment.apiUrl}/images`
};