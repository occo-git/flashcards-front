export interface AppRoutes {
  ROOT: string
  ACTIVITY: { 
    QUIZ: string
    TYPE_WORD: string
    FILL_BLANK: string
  }
  CARDS: {
    CARDS_DECK: string
    WORDS_LIST: string
    CHOOSE_THEME: string
    CHOOSE_DIFFICULTY: string
  }
  USER: {  
    PROFILE: string
    CHANGE_LEVEL: string
    PROGRESS: string
  }
  AUTH: {
    REGISTER: string
    RESET_PASSWORD_REQUEST: string
    RESET_PASSWORD: string
    LOGIN: string
    LOGOUT: string
  }
  EMAIL: {
    CONFIRM_EMAIL: string
    RESEND_EMAIL_CONFIRMATION: string
  }
  HELP: string
}

export const CONST_ROUTES: AppRoutes = {
  ROOT: '',
  ACTIVITY: {
    QUIZ: 'quiz',
    TYPE_WORD: 'type-word',
    FILL_BLANK: 'fill-blank'
  },
  CARDS: {
    CARDS_DECK: 'cards-deck',
    WORDS_LIST: 'words-list',
    CHOOSE_THEME: 'choose-theme',
    CHOOSE_DIFFICULTY: 'choose-difficulty'
  },
  USER: {
    PROFILE: 'profile',
    CHANGE_LEVEL: 'change-level',
    PROGRESS: 'progress'
  },
  AUTH: {
    REGISTER: 'register',
    RESET_PASSWORD_REQUEST: 'reset-password-request',
    RESET_PASSWORD: 'reset-password',
    LOGIN: 'login',
    LOGOUT: 'logout'
  },
  EMAIL: {
    CONFIRM_EMAIL: 'confirm-email',
    RESEND_EMAIL_CONFIRMATION: 'resend-email-confirmation'
  },
  HELP: 'help'
};