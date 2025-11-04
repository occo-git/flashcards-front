import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ActivityRequestDto, QuizResponseDto } from '@app/models/activity.dto';
import { CONST_API_PATHS } from '../api.constants';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  quiz = signal<QuizResponseDto | null>(null);

  constructor(
    private http: HttpClient
  ) { }

  getQuiz(request: ActivityRequestDto): Observable<QuizResponseDto> {
    return this.http.post<QuizResponseDto>(CONST_API_PATHS.ACTIVITY.QUIZ, request)
      .pipe(
        tap(quiz => this.quiz.set(quiz))  // save signal
      );
  }

  clearQuiz() {
    this.quiz.set(null);
  }
}
