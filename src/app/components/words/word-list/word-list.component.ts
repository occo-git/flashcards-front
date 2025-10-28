import { Component, ViewEncapsulation, signal, computed } from '@angular/core';

import { LoaderComponent } from '@app/components/_common-ui/loader/loader.component';
import { WordComponent } from '@components/words/word/word.component';
import { UserService } from '@app/services/user/user.service';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { WordDto, WordsRequestDto } from '@models/cards.dto'

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

const CONST_PAGE_SIZE = 10;

@Component({
  selector: 'app-word-list',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [LoaderComponent, WordComponent, ErrorMessageComponent],
  templateUrl: './word-list.html',
  styleUrl: './word-list.scss'
})
export class WordListComponent {

  firstId = signal<number>(0);
  currentWordId = signal<number>(0);
  hasPrevious = signal<boolean>(false);
  hasNext = signal<boolean>(true);
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private userService: UserService,
    private flashcardService: FlashcardService
  ) {
    this.loadWordsPage(0, true); // first item, forward
  }

  userLevel = computed(() => this.userService.currentUserInfo()?.level);
  words = computed(() => this.flashcardService.wordsSignal());

  private loadWordsPage(wordId: number, isDirectionForward: boolean) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorResponse.set(null);

    const request: WordsRequestDto = {
      level: this.userLevel()!,
      isOnlyMarked: false,
      wordId: wordId,
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

  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}