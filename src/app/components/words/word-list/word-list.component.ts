import { Component, ViewEncapsulation, signal, computed, Input } from '@angular/core';
import { Router } from '@angular/router';

import { FilterComponent } from "@app/components/_common-ui/filter/filter.component";
import { WordComponent } from '@components/words/word/word.component';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { DeckFilterDto, CardsPageRequestDto } from '@models/cards.dto'

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CONST_ROUTES } from '@app/routing/routes.constans';
import { FilterService } from '@app/services/filer/filter.service';

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

  firstId = signal<number>(0);
  currentWordId = signal<number>(0);
  hasPrevious = signal<boolean>(false);
  hasNext = signal<boolean>(true);
  words = computed(() => this.flashcardService.wordsSignal());

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private router: Router,
    private filterService: FilterService,
    private flashcardService: FlashcardService
  ) {
    this.loadWordsPage();
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
      next: (words) => {
        this.currentWordId.set(wordId);

        if (words.length > 0) {
          if (isDirectionForward) {
            if (!this.firstId())
              this.firstId.set(words[0].id);
            this.hasPrevious.set(this.currentWordId() !== 0);
            this.hasNext.set(words.length === CONST_PAGE_SIZE);
          } else {
            this.hasPrevious.set(this.firstId() < words[0].id);
            this.hasNext.set(true);
          }
        }
        else {
          this.hasPrevious.set(false);
          this.hasNext.set(false);
        }

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

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}