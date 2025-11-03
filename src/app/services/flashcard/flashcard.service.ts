import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { CardsPageRequestDto, CardDto, CardRequestDto, CardExtendedDto } from '@models/cards.dto';
import { WordRequestDto, WordDto } from '@models/cards.dto';
import { CONST_API_PATHS } from '@services/api.constants';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {

  private card = signal<CardExtendedDto | null>(null);
  private cards = signal<CardDto[]>([]);
  private words = signal<WordDto[]>([]);
  get cardSignal() { return this.card.asReadonly(); }
  get cardsSignal() { return this.cards.asReadonly(); }
  get wordsSignal() { return this.words.asReadonly(); }

  constructor(
    private http: HttpClient
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

  changeMark(request: WordRequestDto) {
    return this.http.post(CONST_API_PATHS.CARDS.CHANGE_MARK, request);
  }
}