import { DeckFilterDto, WordDto } from "@models/cards.dto";

export interface ActivityRequestDto {
    filter: DeckFilterDto
    count: number
}

export interface QuizResponseDto {
    words: WordDto[]
}