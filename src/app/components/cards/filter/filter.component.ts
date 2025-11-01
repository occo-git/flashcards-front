import { Component, signal, computed, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { UserService } from '@services/user/user.service';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { LevelFilterDto, ThemeDto, BookmarkDto } from '@models/cards.dto';
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
export class FilterComponent {
  @Output() themeSelected = new EventEmitter<number>();
  @Output() bookmarkSelected = new EventEmitter<number>();

  ICON = SVG_ICON;
  userLevel = computed(() => this.userService.userLevel());
  themes = computed(() => this.flashcardService.themesSignal());
  bookmarks = signal<BookmarkDto[]>([
    { id: 0, isAll: true, name: '• All' },
    { id: 1, isAll: false, name: 'Marked' },
    { id: -1, isAll: false, name: 'Not Marked' }
  ]);
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  selectedThemeId = signal<number>(0);
  selectedBookmarkId = signal<number>(0);

  constructor(
    private userService: UserService,
    private flashcardService: FlashcardService
  ) {
    this.loadThemes();
  }

  private loadThemes() {
    if (this.isLoading() || !this.userLevel()) return;

    this.errorResponse.set(null);
    this.isLoading.set(true);

    const filter: LevelFilterDto = {
      level: this.userLevel()!
    }

    this.flashcardService.getThemes(filter).subscribe({
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
    this.selectedThemeId.set(themeId);
    this.themeSelected.emit(themeId);
  }

  onBookmarkChange(event: any) {
    const bookmarkId = +event.value; // '+' to get number from string
    this.selectedBookmarkId.set(bookmarkId);
    this.bookmarkSelected.emit(bookmarkId);
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}
