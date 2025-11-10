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
    PROGRESS: string
    SAVE_PROGRESS: string
  }
  CARDS: {
    BY_ID: string
    LEVELS: string
    THEMES: string
    CARD_FROM_DECK: string
    LIST: string
    CHANGE_MARK: string
  }
  ACTIVITY: {
    QUIZ: string
    TYPE_WORD: string
    FILL_BLANK: string
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
    LEVEL: `${environment.apiUrl}/users/level`,
    PROGRESS: `${environment.apiUrl}/users/progress`,
    SAVE_PROGRESS: `${environment.apiUrl}/users/progress/save`
  },
  CARDS: {
    BY_ID: `${environment.apiUrl}/cards`,
    LEVELS: `${environment.apiUrl}/cards/levels`, 
    THEMES: `${environment.apiUrl}/cards/themes`,
    CARD_FROM_DECK: `${environment.apiUrl}/cards/card-from-deck`,
    LIST: `${environment.apiUrl}/cards/list`,
    CHANGE_MARK: `${environment.apiUrl}/cards/change-mark`
  },
  ACTIVITY: {
    QUIZ: `${environment.apiUrl}/activity/quiz`,
    TYPE_WORD: `${environment.apiUrl}/activity/type-word`,
    FILL_BLANK: `${environment.apiUrl}/activity/fill-blank`
  },
  IMAGES: `${environment.apiUrl}/images`
};