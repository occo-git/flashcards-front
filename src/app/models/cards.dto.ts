//#region Request
export interface CardsPageRequestDto {
  wordId: number
  filter: DeckFilterDto
  isDirectionForward: boolean
  pageSize: number
}

export interface CardRequestDto {
  wordId: number
  filter: DeckFilterDto
}

export interface DeckFilterDto {
  level: string
  isMarked: number // -1 | 0 | 1
  themeId: number
  difficulty: number
}

export interface LevelFilterDto {
  level: string
}
//#endregion

//#endregion Respond
export interface CardDto {
  id: number
  wordText: string
  transcription: string
  partOfSpeech: string
  translation: { en: string; ru: string }
  example: string
  level: string //'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  isMarked: boolean
  difficulty: number
  imageUrl?: string
}

export interface WordDto {
  id: number
  wordText: string
  translation: TranslationDto
  isMarked: boolean
}

export interface CardExtendedDto { 
  card: CardDto
  prevCard: CardInfo,
  nextCard: CardInfo
  index: number
  total: number
}

export interface CardInfo { 
  id: number
  wordText: string
}

export interface ThemeDto {
  id: number
  isAll: boolean
  level: string
  translation: TranslationDto
  wordsCount: number
}

export interface TranslationDto {
  en: string
  ru: string
}
//#endregion