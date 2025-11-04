import { Component, signal, computed, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { FilterService } from '@services/filer/filter.service';
import { DeckFilterDto } from '@models/cards.dto';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [MatSelectModule, SvgIconComponent, ErrorMessageComponent],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class FilterComponent  {
  @Output() filter = new EventEmitter<DeckFilterDto>();

  readonly ICON = SVG_ICON;
  bookmarks = computed(() => this.filterService.bookmarksSignal());
  themes = computed(() => this.filterService.themesSignal());
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  selectedBookmarkId = computed(() => this.filterService.selectedBookmarkId());
  selectedThemeId = computed(() => this.filterService.selectedThemeId());
  selectedDifficultyId = computed(() => this.filterService.selectedDifficultyId());

  constructor(
    private filterService: FilterService
  ) {
    this.loadThemes();
  }

  private loadThemes() {
    if (this.isLoading()) return;

    this.errorResponse.set(null);
    this.isLoading.set(true);

    this.filterService.getThemes().subscribe({
      next: themes => {
        this.isLoading.set(false);
      },
      error: err => {
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  onThemeChange(event: any) {
    const themeId = +event.value; // '+' to get number from string
    this.filterService.selectedThemeId.set(themeId);
    this.emit();
  }

  onBookmarkChange(event: any) {
    const bookmarkId = +event.value; // '+' to get number from string
    this.filterService.selectedBookmarkId.set(bookmarkId);
    this.emit();
  }

  private emit() {
    this.filter.emit(this.filterService.getFilter());
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}