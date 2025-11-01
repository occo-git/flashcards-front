import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '@services/user-session/user-session.service';
import { CardsPageRequestDto, CardDto, WordDto, CardRequestDto, CardExtendedDto, LevelFilterDto, ThemeDto, TranslationDto } from '@models/cards.dto';
import { CONST_API_PATHS } from '@services/api.constants';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {

  // Signals for reactive storage
  private levels = signal<string[]>([]);
  private themes = signal<ThemeDto[]>([]);
  private card = signal<CardExtendedDto | null>(null);
  private cards = signal<CardDto[]>([]);
  private words = signal<WordDto[]>([]);

  get levelsSignal() { return this.levels.asReadonly(); }
  get themesSignal() { return this.themes.asReadonly(); }
  get cardSignal() { return this.card.asReadonly(); }
  get cardsSignal() { return this.cards.asReadonly(); }
  get wordsSignal() { return this.words.asReadonly(); }

  constructor(
    private http: HttpClient,
    private session: UserSessionService
  ) { }

  getFlashcard(request: CardRequestDto): Observable<CardExtendedDto> {
    return this.http.post<CardExtendedDto>(CONST_API_PATHS.CARDS.CARD_FROM_DECK, request)
      .pipe(
        tap(card => this.card.set(card))  // save signal
      );
  }

  getFlashcards(request: CardsPageRequestDto): Observable<CardDto[]> {
    return this.http.post<CardDto[]>(CONST_API_PATHS.CARDS.DECK, request)
      .pipe(
        tap(response => this.cards.set(response))  // save signal
      );
  }

  getWords(request: CardsPageRequestDto): Observable<WordDto[]> {
    return this.http.post<WordDto[]>(CONST_API_PATHS.CARDS.DECK, request)
      .pipe(
        tap(response => this.words.set(response))  // save signal
      );
  }

  getLevels(): Observable<string[]> {
    return this.http.get<string[]>(CONST_API_PATHS.CARDS.LEVELS)
      .pipe(
        tap(response => this.levels.set(response)) // save signal
      );
  }

  getThemes(request: LevelFilterDto): Observable<ThemeDto[]> {
    return this.http.post<ThemeDto[]>(CONST_API_PATHS.CARDS.THEMES, request)
      .pipe(
        map(response => {
          // All themes
          const allTheme: ThemeDto = {
            id: 0,
            level: request.level,
            isAll: true,
            translation: { 'en': '• All', 'ru': '' } as TranslationDto,
            wordsCount: 0
          };

          return [allTheme, ...response];
        }),
        tap(themesWithAll => {
          this.themes.set(themesWithAll); // сохраняем в сигнал
        })
      );
  }
}