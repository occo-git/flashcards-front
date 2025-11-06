
import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FilterService } from '@services/filer/filter.service';
import { SoundService } from '@services/sound/sound.service';
import { ActivityService } from '@services/activity/activity.service';
import { ActivityProgressRequestDto, ActivityRequestDto } from '@models/activity.dto';
import { DeckFilterDto, WordDto } from '@models/cards.dto';

import { WordResultsComponent } from "@components/_common-ui/results/word-results/word-results.component";
import { FilterComponent } from "@components/cards/filter/filter.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';

import { CONST_VALIDATION } from '@validation/validation.constants'
import { CustomValidators } from '@validation/custom-validators';
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-type-word',
  imports: [FilterComponent, WordResultsComponent, SvgIconComponent, ReactiveFormsModule, ErrorMessageDirective, ErrorMessageComponent],
  templateUrl: './type-word.html',
  styleUrl: './type-word.scss'
})
export class TypeWordComponent {
  @ViewChild('resultsComponent') resultsComponent!: WordResultsComponent;
  form = new FormGroup(
    {
      wordText: new FormControl(
        CONST_VALIDATION.DEFAULT_VALUE, [
        CustomValidators.required('Text is required')
      ])
    })

  readonly OPTIONS_COUNT: number = 1;
  readonly ICON = SVG_ICON;

  filter = computed(() => this.filterService.getFilter());
  word = signal<WordDto | null>(null);
  wordId = computed(() => this.word()?.id ?? 0);
  activityType = signal<string | null>(null);
  result = signal<number>(0);
  total = signal<number>(0);

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private filterService: FilterService,
    private soundService: SoundService,
    private activityService: ActivityService
  ) {
    this.loadTypeWord();
  }

  applyFilter(filter: DeckFilterDto) {
    this.loadTypeWord();
  }

  private loadTypeWord() {
    this.errorResponse.set(null);
    this.isLoading.set(true);

    const request: ActivityRequestDto = {
      filter: this.filter()
    }
    this.activityService.getTypeWord(request).subscribe({
      next: response => {
        this.activityType.set(response.activityType);
        this.word.set(response.word);
        this.isLoading.set(false);
      },
      error: err => {
        this.activityType.set(null);
        this.activityService.clearTypeWord();
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    if (this.form.valid) {
      const v = this.form.value;
      if (v) {
        this.total.set(this.total() + 1);
        const wordText = v.wordText ?? CONST_VALIDATION.DEFAULT_VALUE
        this.formReset();
        if (wordText === this.word()?.wordText) {
          this.result.set(this.result() + 1);
          this.soundService.playOk();
          this.saveProgress(true);
        } else {
          this.soundService.playWrong();
          this.saveProgress(false);
        }
      }
    } else {
      console.log('Form is invalid');
    }
  }

  playSound(audio: HTMLAudioElement) {
    audio.currentTime = 0; // сброс, чтобы можно было кликать много раз
    audio.play().catch(err => { });
  }

  formReset() {
    this.form.reset();                    // reset values
    this.form.markAsPristine();           // unmark dirty flags
    this.form.markAsUntouched();          // reset touched
    this.form.updateValueAndValidity();   // update validation status
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
        next: response => { this.loadTypeWord(); },
        error: err => { this.errorResponse.set(err); }
      });    
    }
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}