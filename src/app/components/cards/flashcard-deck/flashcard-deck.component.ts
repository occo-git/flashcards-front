import { Component, signal, computed, ViewEncapsulation } from '@angular/core';

import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { FlashcardComponent } from '@components/cards/flashcard/flashcard.component';
import { FlashcardService } from '@services/flashcard/flashcard.service';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '@app/services/user/user.service';
import { WordsRequestDto } from '@app/models/cards.dto';

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
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  cards = computed(() => this.flashcardService.flashcardsSignal());
  currentCard = computed(() => this.cards()[this.currentIndex()] || null);
  userLevel = computed(() => this.userService.currentUserInfo()?.level);

  previousCardText = computed(() =>
    this.currentIndex() > 0 ? this.cards()[this.currentIndex() - 1]?.text : ''
  );

  nextCardText = computed(() =>
    this.currentIndex() < this.cards().length - 1 ? this.cards()[this.currentIndex() + 1]?.text : ''
  );

  constructor(
    private userService: UserService,
    private flashcardService: FlashcardService
  ) {
    this.init();
  }

  private init() {
    this.errorResponse.set(null);
    this.isLoading.set(true);

    const request: WordsRequestDto = {
      level: this.userLevel()!,
      isOnlyMarked: false,
      wordId: 0,
      isDirectionForward: true, pageSize: 100
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

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(true);
  }
}