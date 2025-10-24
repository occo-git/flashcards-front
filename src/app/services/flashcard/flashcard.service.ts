import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FlashcardDto } from '@models/flashcard.dto';
import { LoggerService } from '@services/logger/logger.service';
import { CONST_API_PATHS } from '@services/api.constants';

@Injectable({
  providedIn: 'root'  // Глобальный singleton
})
export class FlashcardService {

  private flashcards = signal<FlashcardDto[]>([]);  // Signal для реактивного хранения списка

  constructor(
    private http: HttpClient, 
    private logger: LoggerService
  ) { }

  getFlashcards(): Observable<FlashcardDto[]> {
    return this.http.get<FlashcardDto[]>(`${CONST_API_PATHS.CARDS.DECK}/?lastId=0&pageSize=10`).pipe(
      tap(data => this.flashcards.set(data))  // Обновляем signal
    );
  }

  // Getter для доступа к сигналу (для реактивного использования в компонентах)
  get flashcardsSignal() {
    return this.flashcards.asReadonly();
  }
}