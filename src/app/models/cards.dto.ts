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
  text: string
  transcription: string
  partOfSpeech: string
  translation: { en: string; ru: string }
  example: string
  level: string //'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty: number
  imageUrl?: string
}

export interface WordDto {
  id: number
  text: string
  translation: TranslationDto
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
  level: string
  translation: TranslationDto
  wordsCount: number
}

export interface TranslationDto {
  en: string
  ru: string
}
//#endregion