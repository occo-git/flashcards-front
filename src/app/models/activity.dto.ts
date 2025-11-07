import { DeckFilterDto, WordDto } from "@models/cards.dto";

//#region Request
export interface ActivityRequestDto {
    filter: DeckFilterDto
    count?: number
}

export interface ActivityProgressRequestDto {
    activityType: string
    wordId: number
    fillBlankId: number | null
    isSuccess: boolean
}
//#endregion

//#region Response
export interface QuizResponseDto {
    activityType: string
    words: WordDto[]
}

export interface TypeWordResponseDto {
    activityType: string
    word: WordDto
}

export interface FillBlankResponseDto {
    activityType: string
    fillBlank: FillBlankDto
    words: WordDto[]
}

export interface FillBlankDto {
    id: number
    wordId: number
    blankTemplate: string
}

export interface ProgressResponseDto {
    groups: ProgressSummaryGroup[]
}

export interface ProgressSummaryGroup {
    name: string
    key: string
    correctCount: number
    totalAttempts: number
}
//#endregion