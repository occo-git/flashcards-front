import { Component, signal, computed, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FlashcardComponent } from '@components/cards/flashcard/flashcard.component';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { UserService } from '@services/user/user.service';
import { DeckFilterDto, CardRequestDto } from '@models/cards.dto';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FilterComponent } from "@components/cards/filter/filter.component";

@Component({
  selector: 'app-flashcard-from-deck',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FlashcardComponent, ErrorMessageComponent, SvgIconComponent, FilterComponent],
  templateUrl: './flashcard-from-deck.html',
  styleUrl: './flashcard-from-deck.scss'
})
export class FlashcardFromDeckComponent {
  @Input() set themeId(value: number) {
    this.selectedThemeId.set(value);
    this.loadFlashcard(); // ← Перезагружаем карточки
  }
  @Input() set bookmarkId(value: number) {
    this.selectedBookmarkId.set(value);
    this.loadFlashcard(); // ← Перезагружаем карточки
  }

  ICON = SVG_ICON;
  userLevel = computed(() => this.userService.userLevel());
  selectedThemeId = signal<number>(0);
  selectedBookmarkId = signal<number>(0);

  card = computed(() => this.flashcardService.cardSignal());
  index = computed(() => this.card()?.index ?? 0);
  isMarked = computed(() => this.card()?.card?.isMarked ?? false);
  total = computed(() => this.card()?.total ?? 0);
  prevCard = computed(() => this.card()?.prevCard);
  nextCard = computed(() => this.card()?.nextCard);
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private flashcardService: FlashcardService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      const wordId = +params['wordId'] || 0;
      if (wordId > 0)
        this.loadFlashcard(wordId);
      else
        this.loadFlashcard();
    });
  }

  private loadFlashcard(wordId: number = 0) {
    if (this.isLoading() || !this.userLevel()) return;

    this.errorResponse.set(null);
    this.isLoading.set(true);

    const filter: DeckFilterDto = {
      level: this.userLevel()!,
      isMarked: this.selectedBookmarkId(),
      themeId: this.selectedThemeId(),
      difficulty: 0
    }
    const request: CardRequestDto = {
      wordId: wordId,
      filter: filter
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

  onBookmark(mark: boolean) {

  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(true);
  }
}
