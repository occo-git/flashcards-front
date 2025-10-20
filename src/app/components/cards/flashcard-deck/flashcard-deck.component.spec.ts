import { Component, signal, computed, inject } from '@angular/core';
import { FlashcardComponent } from '../flashcard/flashcard.component';
import { FlashcardService } from '../../../services/flashcard/flashcard.service';
import { Flashcard } from '../../../models/flashcard.interface';

@Component({
  selector: 'app-flashcard-deck',
  standalone: true,
  imports: [FlashcardComponent],
  templateUrl: './flashcard-deck.html',
  styleUrls: ['./flashcard-deck.scss']
})
export class FlashcardDeckComponent {
  private flashcardService = inject(FlashcardService);
  cards = this.flashcardService.flashcardsSignal; // Получаем сигнал из сервиса
  currentIndex = signal(0); // Индекс текущей карточки

  // Получаем текущую карточку на основе индекса
  currentCard = computed(() => this.cards()[this.currentIndex()] || null);

  constructor() {
    this.flashcardService.getFlashcards().subscribe({
      error: () => console.error('Failed to load flashcards')
    });
  }

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