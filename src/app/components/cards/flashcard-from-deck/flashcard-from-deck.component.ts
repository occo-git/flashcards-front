import { Component, signal, computed, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FilterComponent } from "@components/cards/filter/filter.component";
import { FlashcardComponent } from '@components/cards/flashcard/flashcard.component';
import { FilterService } from '@services/filer/filter.service';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { DeckFilterDto, CardRequestDto, WordRequestDto } from '@models/cards.dto';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-flashcard-from-deck',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FlashcardComponent, ErrorMessageComponent, SvgIconComponent, FilterComponent],
  templateUrl: './flashcard-from-deck.html',
  styleUrl: './flashcard-from-deck.scss'
})
export class FlashcardFromDeckComponent {
  readonly ICON = SVG_ICON;
  filter = computed(() => this.filterService.getFilter());

  card = computed(() => this.flashcardService.cardSignal());
  wordId = computed(() => this.card()?.card?.id);
  isMarked = computed(() => this.card()?.card?.isMarked ?? false);
  index = computed(() => this.card()?.index ?? 0);
  total = computed(() => this.card()?.total ?? 0);
  prevCard = computed(() => this.card()?.prevCard);
  nextCard = computed(() => this.card()?.nextCard);

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private filterService: FilterService,
    private flashcardService: FlashcardService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.filterService.applyFilterParams(params);

      const wordId = +params['wordId'] || 0;
      this.loadFlashcard(wordId);
    });
  }

  applyFilter(filter: DeckFilterDto) {
    this.loadFlashcard();
  }

  private loadFlashcard(wordId: number = 0) {
    if (this.isLoading()) return;

    this.errorResponse.set(null);
    this.isLoading.set(true);

    const request: CardRequestDto = {
      wordId: wordId,
      filter: this.filter()
    };

    this.flashcardService.getFlashcard(request).subscribe({
      next: card => {
        this.isLoading.set(false);
      },
      error: err => {
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  onPreviousCard() {
    if (this.prevCard()) {
      this.loadFlashcard(this.prevCard()!.id);
    }
  }

  onNextCard() {
    if (this.nextCard())
      this.loadFlashcard(this.nextCard()!.id)
  }

  onBookmark() {
    if (!this.wordId()) return;

    this.errorResponse.set(null);
    this.isLoading.set(true);
    const wordId = this.wordId()!;

    const request: WordRequestDto = { wordId: wordId };
    this.flashcardService.changeMark(request).subscribe({
      next: card => {
        this.isLoading.set(false);
        this.loadFlashcard(wordId);
      },
      error: err => {
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(true);
  }
}