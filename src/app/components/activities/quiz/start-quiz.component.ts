import { Component, computed, EventEmitter, Input, signal, ViewEncapsulation } from '@angular/core';

import { FilterComponent } from "@components/cards/filter/filter.component";
import { WordComponent } from "@components/words/word/word.component";
import { FilterService } from '@services/filer/filter.service';
import { ActivityService } from '@services/actions/activity.service';
import { ActivityRequestDto } from '@models/activity.dto';
import { DeckFilterDto, WordDto } from '@app/models/cards.dto';
import { SvgIconComponent } from "@app/components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@app/components/svg-icon.constants';

import { ErrorMessageComponent } from "@components/_common-ui/error-message/error-message.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-start-quiz',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FilterComponent, ErrorMessageComponent, WordComponent, SvgIconComponent],
  templateUrl: './start-quiz.html',
  styleUrl: './start-quiz.scss'
})
export class StartQuizComponent {

  readonly OPTIONS_COUNT: number = 4;
  readonly ICON = SVG_ICON;
  private AUDIO_RIGHT = new Audio('/sounds/right.mp3');
  private AUDIO_WRONG = new Audio('/sounds/wrong.mp3');

  filter = computed(() => this.filterService.getFilter());
  quiz = computed(() => this.activityService.quiz());
  word = signal<WordDto | null>(null);
  result = signal<number>(0);
  total = signal<number>(0);

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private filterService: FilterService,
    private activityService: ActivityService
  ) {
    this.loadQuiz();
  }

  applyFilter(filter: DeckFilterDto) {
    this.loadQuiz();
  }

  private loadQuiz() {
    this.errorResponse.set(null);
    this.isLoading.set(true);

    const request: ActivityRequestDto = {
      filter: this.filter(),
      count: this.OPTIONS_COUNT
    }
    this.activityService.getQuiz(request).subscribe({
      next: quiz => {
        const randomIndex = Math.floor(Math.random() * quiz.words.length);
        this.word.set(quiz.words[randomIndex]);
        this.isLoading.set(false);
      },
      error: err => {
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  onWordSelected(wordId: number) {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.total.set(this.total() + 1)
    if (wordId === this.word()?.id) {
      this.result.set(this.result() + 1);
      this.playSound(this.AUDIO_RIGHT);
      this.saveWordProgress(wordId, true);
    } else {
      this.playSound(this.AUDIO_WRONG);
      this.saveWordProgress(wordId, false);
    }
  }

  playSound(audio: HTMLAudioElement) {
    audio.currentTime = 0; // сброс, чтобы можно было кликать много раз
    audio.play().catch(err => { });
  }

  saveWordProgress(wordId: number, result: boolean) {
    this.loadQuiz();
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}