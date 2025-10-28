export interface WordsRequestDto {
  level: string
  isOnlyMarked: boolean
  wordId: number
  isDirectionForward: boolean
  pageSize: number
}

export interface FlashcardDto {
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
  translation: { en: string; ru: string }
}