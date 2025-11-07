import { Component, computed, signal, ViewEncapsulation } from '@angular/core';

import { ActivityService } from '@services/activity/activity.service';
import { ProgressResponseDto, ProgressSummaryGroup } from '@models/activity.dto';

import { ProgressBarComponent } from "@components/_common-ui/progress-bar/progress-bar.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, USER_ITEMS } from '@components/_common-ui/ui.constants';

import { ErrorMessageComponent } from "@components/_common-ui/error-message/error-message.component";
import { HttpErrorResponse } from '@angular/common/http';

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
  readonly ICONS = ICONS;
  readonly USER_ITEMS = USER_ITEMS;

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
      .map(([name, groups]) => ({ name, groups }));
  });

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