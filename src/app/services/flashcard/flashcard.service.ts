import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { retryWhen, switchMap, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '@app/services/user-session/user-session.service';
import { WordsRequestDto, FlashcardDto, WordDto } from '@app/models/cards.dto';
import { CONST_API_PATHS } from '@services/api.constants';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {

  // Signals for reactive storage
  private flashcards = signal<FlashcardDto[]>([]);  
  private words = signal<WordDto[]>([]); 
  private levels = signal<string[]>([]);

  constructor(
    private http: HttpClient,
    private session: UserSessionService
  ) { }

  getFlashcards(request: WordsRequestDto): Observable<FlashcardDto[]> {
    
    return this.session.getHeaders().pipe(
      switchMap(headers =>
        this.http.post<FlashcardDto[]>(CONST_API_PATHS.CARDS.DECK, request, { headers })
      ),
      tap(response => this.flashcards.set(response))  // save signal
    );
  }

  getWords(request: WordsRequestDto): Observable<WordDto[]> {
    return this.session.getHeaders().pipe(
      switchMap(headers =>
        this.http.post<WordDto[]>(CONST_API_PATHS.CARDS.DECK, request, { headers })
      ),
      tap(response => this.words.set(response))  // save signal
    );
  }

  getLevels(): Observable<string[]> {
    return this.session.getHeaders().pipe(
      switchMap(headers => 
        this.http.get<string[]>(CONST_API_PATHS.CARDS.LEVELS, { headers })
      ),
      tap(response => this.levels.set(response)) // save signal
    );
  }

  // Getter to access signal (for reactive usage in components)
  get flashcardsSignal() {
    return this.flashcards.asReadonly();
  }
  get wordsSignal() {
    return this.words.asReadonly();
  }
}