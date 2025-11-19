export interface SendEmailConfirmationRequestDto {
  email: string
}

export interface SendEmailConfirmationResponseDto {
  message: string
  isAlreadyConfirmed: boolean
}

export interface ConfirmEmailRequestDto {
  token: string
}

export interface ConfirmEmailResponseDto {
  message: string
}