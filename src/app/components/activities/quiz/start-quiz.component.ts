import { Component, computed, Input, signal, ViewEncapsulation } from '@angular/core';
import { FilterComponent } from "@components/cards/filter/filter.component";
import { ErrorMessageComponent } from "@components/_common-ui/error-message/error-message.component";
import { DeckFilterDto } from '@app/models/cards.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { FilterService } from '@app/services/filer/filter.service';
import { ActivityService } from '@app/services/actions/activity.service';

@Component({
  selector: 'app-start-quiz',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FilterComponent, ErrorMessageComponent],
  templateUrl: './start-quiz.html',
  styleUrl: './start-quiz.scss'
})
export class StartQuizComponent {
  //ICON = SVG_ICON;
  filter = computed(() => this.filterService.getFilter());

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

  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}