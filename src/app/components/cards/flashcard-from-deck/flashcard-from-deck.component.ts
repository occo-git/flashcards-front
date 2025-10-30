import { Component, signal, computed, effect, ViewEncapsulation } from '@angular/core';

import { FlashcardComponent } from '@components/cards/flashcard/flashcard.component';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { UserService } from '@app/services/user/user.service';
import { DeckFilterDto, CardRequestDto } from '@app/models/cards.dto';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FilterComponent } from "@components/cards/filter/filter.component";

@Component({
  selector: 'app-flashcard-from-deck',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FlashcardComponent, ErrorMessageComponent, FilterComponent],
  templateUrl: './flashcard-from-deck.html',
  styleUrl: './flashcard-from-deck.scss'
})
export class FlashcardFromDeckComponent {
  userLevel = computed(() => this.userService.userLevel());
  card = computed(() => this.flashcardService.cardSignal());  
  index = computed(() => this.card()?.index ?? 0);
  total = computed(() => this.card()?.total ?? 0);
  prevCard = computed(() => this.card()?.prevCard);
  nextCard = computed(() => this.card()?.nextCard);
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private userService: UserService,
    private flashcardService: FlashcardService
  ) {
    this.loadFlashcard();
  }

  private loadFlashcard(wordId: number = 0) {
    if (this.isLoading() || !this.userLevel()) return;

    this.errorResponse.set(null);
    this.isLoading.set(true);

    const filter: DeckFilterDto = {
      level: this.userLevel()!,
      isMarked: 0,
      themeId: 0,
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

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(true);
  }
}
