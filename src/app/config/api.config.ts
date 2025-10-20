import { environment } from '@env/environment';

export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  ENDPOINTS: {
    CARDS: '/cards',
    CARDS_DEFAULT: '/cards?lastId=0&pageSize=10',
    USERS: '/users',
    IMAGES: '/images'
  }
};