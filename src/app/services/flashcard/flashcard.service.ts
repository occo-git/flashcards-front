import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';  // Для сайд-эффектов
import { Flashcard } from '@models/flashcard.interface';
import { API_CONFIG } from '@config/api.config';
import { LoggerService } from '@services/logger/logger.service';

@Injectable({
  providedIn: 'root'  // Глобальный singleton
})
export class FlashcardService {
  private apiUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS_DEFAULT;
  private flashcards = signal<Flashcard[]>([]);  // Signal для реактивного хранения списка

  constructor(private http: HttpClient, private logger: LoggerService) {
    this.logger.info('>> LOG: FlashcardService initialized with API URL: ' + this.apiUrl);
  }

  // Метод для получения потока данных из API
  getFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(this.apiUrl).pipe(
      tap(data => this.flashcards.set(data))  // Обновляем signal при успешном запросе
    );
  }

  // Getter для доступа к сигналу (для реактивного использования в компонентах)
  get flashcardsSignal() {
    return this.flashcards.asReadonly();  // Только для чтения
  }
}