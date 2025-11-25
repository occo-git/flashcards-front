import { Component, ViewEncapsulation, signal, computed, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FilterComponent } from "@app/components/_common-ui/filter/filter.component";
import { WordComponent } from '@components/words/word/word.component';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { DeckFilterDto, CardsPageRequestDto, WordDto, WordRequestDto } from '@models/cards.dto'

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CONST_ROUTES } from '@app/routing/routes.constans';
import { FilterService } from '@app/services/filter/filter.service';

const CONST_PAGE_SIZE = 10;

@Component({
  selector: 'app-word-list',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [WordComponent, ErrorMessageComponent, FilterComponent],
  templateUrl: './word-list.html',
  styleUrl: './word-list.scss'
})
export class WordListComponent {
  filter = computed(() => this.filterService.getFilter());

  words = signal<WordDto[]>([]);
  hasPrevious = signal<boolean>(false);
  hasNext = signal<boolean>(false);

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    private flashcardService: FlashcardService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.filterService.applyFilterParams(params);

      this.loadWordsPage();
    });
  }

  applyFilter(filter: DeckFilterDto) {
    this.loadWordsPage();
  }

  private loadWordsPage(wordId: number = 0, isDirectionForward: boolean = true) { // default: 0 - first item, true - forward
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorResponse.set(null);

    const request: CardsPageRequestDto = {
      wordId: wordId,
      filter: this.filter(),
      isDirectionForward: isDirectionForward,
      pageSize: CONST_PAGE_SIZE
    };

    this.flashcardService.getWords(request).subscribe({
      next: (allWords) => {
        // allWords = [prevWord?, ...pageWords..., nextWord?]
        // prevWord, nextWord - can be null

        const hasPrev = allWords[0] !== null;
        const hasNext = allWords[allWords.length - 1] !== null;
        const pageWords = allWords.slice(1, -1) as WordDto[];

        this.words.set(pageWords);
        this.hasPrevious.set(hasPrev);
        this.hasNext.set(hasNext);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  onPreviousWords() {
    if (!this.hasPrevious()) return;

    const firstWordId = this.words()[0]?.id; // first word id of the current page
    if (firstWordId === undefined) return;

    this.loadWordsPage(firstWordId, false); // backwards
  }

  onNextWords() {
    if (!this.hasNext()) return;

    const len = this.words().length;
    const lastWordId = this.words()[len - 1]?.id; // last word id of the current page
    if (lastWordId === undefined) return;

    this.loadWordsPage(lastWordId, true); // forward
  }

  onWordSelected(wordId: number) {
    this.router.navigate([CONST_ROUTES.CARDS.CARDS_DECK], {
      queryParams: { wordId }  // ← Передаём wordId
    });
  }

  onWordChangeMark(wordId: number) {
    const request: WordRequestDto = { wordId: wordId };
    this.flashcardService.changeMark(request).subscribe({
      next: card => {
        this.isLoading.set(false);
        this.loadWordsPage();
      },
      error: err => {
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}