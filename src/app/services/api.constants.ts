import { HttpContextToken } from '@angular/common/http';
import { environment } from '@env/environment';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export interface ApiPaths {
  ROOT: string
  USERS: { 
    BY_ID: string
    ME: string
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
  AUTH: {
    
    REGISTER: string
    LOGIN: string
    REFRESH: string
    LOGOUT: string
  }
  EMAIL: {    
    RESEND_EMAIL_CONFIRMATION: string
    CONFIRM_EMAIL: string
  }
  IMAGES: string
}

export const CONST_API_PATHS: ApiPaths = {
  ROOT: environment.apiUrl,
  USERS: {
    BY_ID: `${environment.apiUrl}/users`,
    ME: `${environment.apiUrl}/users/me`,
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
  AUTH: {
    REGISTER: `${environment.apiUrl}/auth/register`,
    LOGIN: `${environment.apiUrl}/auth/login`,
    REFRESH: `${environment.apiUrl}/auth/refresh`,
    LOGOUT: `${environment.apiUrl}/auth/logout`
  },
  EMAIL: {    
    RESEND_EMAIL_CONFIRMATION: `${environment.apiUrl}/email/resend-email-confirmation`,
    CONFIRM_EMAIL: `${environment.apiUrl}/email/confirm`
  },
  IMAGES: `${environment.apiUrl}/images`
};

export const CONST_API_ERRORS = {
  AUTH: {
    ACCOUNT_NOT_ACTIVE: 'ERR_ACCOUNT_NOT_ACTIVE',
    ERR_CONFIRMATION_FAILED: 'ERR_CONFIRMATION_FAILED',
    CONFIRMATION_LINK_MISMATCH: 'ERR_CONFIRMATION_LINK_MISMATCH',
    CONFIRMATION_LINK_RATE_LIMIT: 'ERR_CONFIRMATION_LINK_RATE_LIMIT',
    CONFIRMATION_SEND_FAIL: 'ERR_CONFIRMATION_SEND_FAIL',
    EMAIL_ALREADY_CONFIRMED: 'ERR_EMAIL_ALREADY_CONFIRMED',
    EMAIL_NOT_CONFIRMED: 'ERR_EMAIL_NOT_CONFIRMED',
    TOKEN_INVALID_FORMAT: 'ERR_TOKEN_INVALID_FORMAT',
    ERROR: 'ERR_ERROR'
  }
};