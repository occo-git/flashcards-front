import { Component, computed, signal, ViewChild, ViewEncapsulation } from '@angular/core';

import { FilterService } from '@services/filer/filter.service';
import { SoundService } from '@services/sound/sound.service';
import { ActivityService } from '@services/activity/activity.service';
import { ActivityProgressRequestDto, ActivityRequestDto } from '@models/activity.dto';
import { DeckFilterDto, WordDto } from '@models/cards.dto';

import { FilterComponent } from "@app/components/_common-ui/filter/filter.component";
import { WordComponent } from "@components/words/word/word.component";
import { WordResultsComponent } from "@components/_common-ui/results/word-results/word-results.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';
import { ACTIVITY_ITEMS, ICONS } from '@components/_common-ui/ui.constants';

import { ErrorMessageComponent } from "@components/_common-ui/error-message/error-message.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fill-blank',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FilterComponent, ErrorMessageComponent, WordComponent, SvgIconComponent, WordResultsComponent],
  templateUrl: './fill-blank.html',
  styleUrl: './fill-blank.scss'
})
export class FillBlankComponent {
  @ViewChild('resultsComponent') resultsComponent!: WordResultsComponent;

  readonly OPTIONS_COUNT: number = 4;
  readonly ICON = SVG_ICON;
  readonly ICONS = ICONS;
  readonly ACTIVITY_ITEMS = ACTIVITY_ITEMS;

  activityType = ACTIVITY_ITEMS.FILL_BLANK;
  filter = computed(() => this.filterService.getFilter());
  fillBlank = computed(() => this.activityService.fillBlank());
  fillBlankId = computed(() => this.activityService.fillBlank()?.fillBlank.id ?? 0);
  fillBlankTemplate = computed(() => this.activityService.fillBlank()?.fillBlank?.blankTemplate);
  word = signal<WordDto | null>(null);
  wordId = computed(() => this.word()?.id ?? 0);
  result = signal<number>(0);
  total = signal<number>(0);

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private filterService: FilterService,
    private activityService: ActivityService,
    private soundService: SoundService
  ) {
    this.loadFillBlank();
  }

  applyFilter(filter: DeckFilterDto) {
    this.loadFillBlank();
  }

  private loadFillBlank() {
    this.errorResponse.set(null);
    this.isLoading.set(true);

    const request: ActivityRequestDto = {
      filter: this.filter(),
      count: this.OPTIONS_COUNT
    }
    this.activityService.getFillBlank(request).subscribe({
      next: response => {
        const wordId = response.fillBlank.wordId;
        const word = response.words.find(w => w.id === wordId);
        this.word.set(word!);
        this.isLoading.set(false);
      },
      error: err => {
        this.activityService.clearFillBlank();
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
    const fillBlankTemplate = this.fillBlankTemplate();
    const word = this.word();

    if (this.resultsComponent && fillBlankTemplate && word)
      this.resultsComponent.addFillBlankRusult(fillBlankTemplate, word, result);

    const activityProgressRequest: ActivityProgressRequestDto = {
      activityType: this.activityType,
      wordId: this.wordId(),
      fillBlankId: this.fillBlankId(),
      isSuccess: result
    };
    this.activityService.saveProgress(activityProgressRequest).subscribe({
      next: response => { this.loadFillBlank(); },
      error: err => { this.errorResponse.set(err); }
    });
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}