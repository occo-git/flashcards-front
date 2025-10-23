import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemDetailsDto } from '@models/problem-details.dto'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.html',
  styleUrl: './error-message.scss'
})
export class ErrorMessageComponent {
  @Input() errorResponse: HttpErrorResponse | null = null;
  @Output() clearError = new EventEmitter<void>();

  get problemDetails(): ProblemDetailsDto | null {
    return this.errorResponse && this.errorResponse.error ? (this.errorResponse.error as ProblemDetailsDto) : null;
  }

  get type(): string | null {
    return this.problemDetails?.type ?? null;
  }

  get title(): string | null {
    return this.problemDetails?.title ?? null;
  }

  get status(): number | null {
    return this.problemDetails?.status ?? this.errorResponse?.status ?? null;
  }

  get detail(): string | null {
    return this.problemDetails?.detail ?? this.errorResponse?.message ?? null;
  }

  get instance(): string | null {
    return this.problemDetails?.instance ?? null;
  }

  closeError() {
    this.clearError.emit();
  }
}