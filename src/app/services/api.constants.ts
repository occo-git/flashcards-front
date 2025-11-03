import { HttpContextToken } from '@angular/common/http';
import { environment } from '@env/environment';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

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
    CHANGE_MARK: string
  }
  ACTIVITY: {
    QUIZ: string
    TYPEWORD: string
    FILL_BLANK: string
    SAVE: string
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
    LEVELS: `${environment.apiUrl}/cards/levels`, 
    THEMES: `${environment.apiUrl}/cards/themes`,
    DECK: `${environment.apiUrl}/cards/deck`,
    CARD_FROM_DECK: `${environment.apiUrl}/cards/card-from-deck`,
    LIST: `${environment.apiUrl}/cards/list`,
    CHANGE_MARK: `${environment.apiUrl}/cards/change-mark`
  },
  ACTIVITY: {
    QUIZ: `${environment.apiUrl}/activity/quiz`,
    TYPEWORD: `${environment.apiUrl}/activity/type-word`,
    FILL_BLANK: `${environment.apiUrl}/activity/fill-blank`,
    SAVE: `${environment.apiUrl}/activity/save`
  },
  IMAGES: `${environment.apiUrl}/images`
};