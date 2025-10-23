export interface AppRoutes {
  ROOT: string;
  ACTIVITY: { 
    QUIZ: string;
    TYPE_WORD: string;
    FILL_BLANK: string;
  };
  CARDS: {
    CARDS_DECK: string;
    WORDS_LIST: string;
    CHOOSE_THEME: string;
    CHOOSE_DIFFICULTY: string;
  };
  USER: {  
    PROGRESS: string;
    CHANGE_LEVEL: string;
  };
  AUTH: {
    REGISTER: string;
    LOGIN: string;
    LOGOUT: string;
  };
  HELP: string;  
}

export const CONST_ROUTES: AppRoutes = {
  ROOT: '',
  ACTIVITY: {
    QUIZ: 'quiz',
    TYPE_WORD: 'type-word',
    FILL_BLANK: 'fill-blank',
  },
  CARDS: {
    CARDS_DECK: 'cards-deck',
    WORDS_LIST: 'words-list',
    CHOOSE_THEME: 'choose-theme',
    CHOOSE_DIFFICULTY: 'choose-difficulty'
  },
  USER: {
    PROGRESS: 'progress',
    CHANGE_LEVEL: 'change-level',
  },
  AUTH: {
    REGISTER: 'register',
    LOGIN: 'login',
    LOGOUT: 'logout',
  }, 
  HELP: 'help',
};