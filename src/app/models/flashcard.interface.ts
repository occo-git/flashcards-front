export interface Flashcard {
  id: number;
  text: string;
  transcription: string;
  partOfSpeech: string;
  translation: { en: string; ru: string };
  example: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty: number;
  imageUrl?: string;
}