export interface SendEmailConfirmationRequestDto {
  token: string
}

export interface SendEmailConfirmationResponseDto {
  success: boolean
  message: string
}

export interface ConfirmEmailRequestDto {
  token: string
}

export interface ConfirmEmailResponseDto {
  success: boolean
  message: string
}