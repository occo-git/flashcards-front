import { Component, computed, signal, ViewChild, ViewEncapsulation } from '@angular/core';

import { FilterService } from '@services/filer/filter.service';
import { SoundService } from '@services/sound/sound.service';
import { ActivityService } from '@services/activity/activity.service';
import { ActivityProgressRequestDto, ActivityRequestDto } from '@models/activity.dto';
import { DeckFilterDto, WordDto } from '@models/cards.dto';

import { FilterComponent } from "@components/cards/filter/filter.component";
import { WordComponent } from "@components/words/word/word.component";
import { WordResultsComponent } from "@components/_common-ui/results/word-results/word-results.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';

import { ErrorMessageComponent } from "@components/_common-ui/error-message/error-message.component";
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-start-quiz',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FilterComponent, ErrorMessageComponent, WordComponent, SvgIconComponent, WordResultsComponent],
  templateUrl: './start-quiz.html',
  styleUrl: './start-quiz.scss'
})
export class StartQuizComponent {
  @ViewChild('resultsComponent') resultsComponent!: WordResultsComponent;

  readonly OPTIONS_COUNT: number = 4;
  readonly ICON = SVG_ICON;

  filter = computed(() => this.filterService.getFilter());
  activityType = signal<string | null>(null);
  quiz = computed(() => this.activityService.quiz());
  word = signal<WordDto | null>(null);
  wordId = computed(() => this.word()?.id ?? 0);
  result = signal<number>(0);
  total = signal<number>(0);

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private filterService: FilterService,
    private soundService: SoundService,
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
      next: response => {
        this.activityType.set(response.activityType);
        const randomIndex = Math.floor(Math.random() * response.words.length);
        this.word.set(response.words[randomIndex]);
        this.isLoading.set(false);
      },
      error: err => {
        this.activityType.set(null);
        this.activityService.clearQuiz();
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  onWordSelected(wordId: number) {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.total.set(this.total() + 1);
    if (wordId === this.wordId()) {
      this.result.set(this.result() + 1);
      this.soundService.playOk();
      this.saveProgress(true);
    } else {
      this.soundService.playWrong();
      this.saveProgress(false);
    }
  }

  saveProgress(result: boolean) {
    const word = this.word();

    if (this.resultsComponent && word)
      this.resultsComponent.addWordResult(word, result);

    const actitvityType = this.activityType();
    if (actitvityType) {
      const activityProgressRequest: ActivityProgressRequestDto = {
        activityType: actitvityType,
        wordId: this.wordId(),
        fillBlankId: null,
        isSuccess: result
      };
      this.activityService.saveProgress(activityProgressRequest).subscribe({
        next: response => { this.loadQuiz(); },
        error: err => { this.errorResponse.set(err); }
      });    
    }
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}