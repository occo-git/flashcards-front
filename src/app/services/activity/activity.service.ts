import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ActivityProgressRequestDto, ActivityRequestDto, FillBlankResponseDto, ProgressResponseDto, QuizResponseDto, TypeWordResponseDto } from '@app/models/activity.dto';
import { CONST_API_PATHS } from '@services/api.constants';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  quiz = signal<QuizResponseDto | null>(null);
  typeWord = signal<TypeWordResponseDto | null>(null);
  fillBlank = signal<FillBlankResponseDto | null>(null);

  constructor(
    private http: HttpClient
  ) { }

  //#region Quiz
  getQuiz(request: ActivityRequestDto): Observable<QuizResponseDto> {
    return this.http.post<QuizResponseDto>(CONST_API_PATHS.ACTIVITY.QUIZ, request)
      .pipe(
        tap(response => this.quiz.set(response))  // save signal
      );
  }

  clearQuiz() {
    this.quiz.set(null);
  }
  //#endregion

  //#region TypeWord
  getTypeWord(request: ActivityRequestDto): Observable<TypeWordResponseDto> {
    return this.http.post<TypeWordResponseDto>(CONST_API_PATHS.ACTIVITY.TYPE_WORD, request)
      .pipe(
        tap(response => this.typeWord.set(response))  // save signal
      );
  }

  clearTypeWord() {
    this.typeWord.set(null);
  }
  //#endregion

  //#region FillBlank
  getFillBlank(request: ActivityRequestDto): Observable<FillBlankResponseDto> {
    return this.http.post<FillBlankResponseDto>(CONST_API_PATHS.ACTIVITY.FILL_BLANK, request)
      .pipe(
        tap(response => this.fillBlank.set(response))  // save signal
      );
  }
  clearFillBlank() {
    this.fillBlank.set(null);
  }
  //#endregion

  //#region Progress
  getProgress(): Observable<ProgressResponseDto> {
    return this.http.get<ProgressResponseDto>(CONST_API_PATHS.USERS.PROGRESS);
  }

  saveProgress(request: ActivityProgressRequestDto): Observable<boolean> {
    return this.http.post<boolean>(CONST_API_PATHS.USERS.PROGRESS_SAVE, request);
  }
  //#endregion
}