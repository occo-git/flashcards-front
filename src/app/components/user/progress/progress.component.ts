import { Component, computed, signal, ViewEncapsulation } from '@angular/core';

import { ActivityService } from '@services/activity/activity.service';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { ProgressResponseDto, ProgressSummaryGroup } from '@models/activity.dto';
import { SVG_ICON } from '@components/svg-icon.constants';

import { ErrorMessageComponent } from "@components/_common-ui/error-message/error-message.component";
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressBarComponent } from "@app/components/_common-ui/progress/progress-bar/progress-bar.component";

@Component({
  selector: 'app-progress',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [SvgIconComponent, ErrorMessageComponent, ProgressBarComponent],
  templateUrl: './progress.html',
  styleUrl: './progress.scss'
})
export class ProgressComponent {

  readonly ICON = SVG_ICON;
  progress = signal<ProgressResponseDto | null>(null);
  groupedProgress = computed(() => {
    const data = this.progress();
    if (!data?.groups) return [];

    const grouped = new Map<string, ProgressSummaryGroup[]>();
    data.groups.forEach(group => {
      const list = grouped.get(group.name) ?? [];
      list.push(group);
      grouped.set(group.name, list);
    });

    return Array
      .from(grouped.entries())
      .map(([name, groups]) => ({name, groups}));
  });
  percentFor(group: ProgressSummaryGroup) {
    return computed(() => {
      const { correctCount, totalAttempts } = group;
      if (totalAttempts === 0) return 0;
      return Math.round((correctCount / totalAttempts) * 100);
    });
  }

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private activityService: ActivityService
  ) {
    this.getProgress();
  }

  getProgress() {
    this.errorResponse.set(null);
    this.isLoading.set(true);

    this.activityService.getProgress().subscribe({
      next: response => {
        this.isLoading.set(false);
        this.progress.set(response);
      },
      error: err => {
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}