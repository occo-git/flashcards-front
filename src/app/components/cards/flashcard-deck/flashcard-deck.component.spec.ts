import { Component, signal, computed, inject } from '@angular/core';
import { FlashcardComponent } from '../flashcard/flashcard.component';
import { FlashcardService } from '../../../services/flashcard/flashcard.service';

@Component({
  selector: 'app-flashcard-deck',
  standalone: true,
  imports: [FlashcardComponent],
  templateUrl: './flashcard-deck.html',
  styleUrls: ['./flashcard-deck.scss']
})
export class FlashcardDeckComponent {

  constructor(
    private flashcardService: FlashcardService
  ) { }

  currentIndex = signal(0);
  cards = computed(() => this.flashcardService.cardsSignal());
  currentCard = computed(() => this.cards()[this.currentIndex()] || null);

  previousCard() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(index => index - 1);
    }
  }

  nextCard() {
    if (this.currentIndex() < this.cards().length - 1) {
      this.currentIndex.update(index => index + 1);
    }
  }
}