import { Component, signal, computed, effect, ViewEncapsulation } from '@angular/core';

import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { FlashcardComponent } from '@components/cards/flashcard/flashcard.component';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { UserService } from '@services/user/user.service';
import { CardsPageRequestDto, DeckFilterDto } from '@models/cards.dto';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-flashcard-deck',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [LoaderComponent, FlashcardComponent, ErrorMessageComponent],
  templateUrl: './flashcard-deck.html',
  styleUrls: ['./flashcard-deck.scss']
})
export class FlashcardDeckComponent {

  currentIndex = signal<number>(0);
  userLevel = computed(() => this.userService.userLevel());
  cards = computed(() => this.flashcardService.cardsSignal());
  currentCard = computed(() => this.cards()[this.currentIndex()] || null);
  previousCardText = computed(() => this.currentIndex() > 0 ? this.cards()[this.currentIndex() - 1]?.wordText : '');
  nextCardText = computed(() => this.currentIndex() < this.cards().length - 1 ? this.cards()[this.currentIndex() + 1]?.wordText : '');
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private userService: UserService,
    private flashcardService: FlashcardService
  ) {
    this.loadFlashcards();
  }

  private loadFlashcards() {
    if (this.isLoading() || !this.userLevel()) return;

    this.errorResponse.set(null);
    this.isLoading.set(true);

    const filter: DeckFilterDto = {
      level: this.userLevel()!,
      isMarked: 0,
      themeId: 0,
      difficulty: 0
    }
    const request: CardsPageRequestDto = {
      filter: filter,
      wordId: 0,
      isDirectionForward: true,
      pageSize: 100
    };

    this.flashcardService.getFlashcards(request).subscribe({
      next: cards => {
        this.isLoading.set(false);
      },
      error: err => {
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  onPreviousCard() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(index => index - 1);
    }
  }

  onNextCard() {
    if (this.currentIndex() < this.cards().length - 1) {
      this.currentIndex.update(index => index + 1);
    }
  }

  onBookmark(mark: boolean) {

  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(true);
  }
}