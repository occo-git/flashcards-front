import { Component, signal, computed, effect, ViewEncapsulation } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { FlashcardComponent } from '@components/cards/flashcard/flashcard.component';
import { UserService } from '@app/services/user/user.service';
import { FlashcardService } from '@services/flashcard/flashcard.service';
import { LevelFilterDto, ThemeDto } from '@app/models/cards.dto';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [MatSelectModule, ErrorMessageComponent],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class FilterComponent {

  userLevel = computed(() => this.userService.userLevel());
  themes = computed(() => this.flashcardService.themesSignal());
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  selectedThemeId: number = 0;
  
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


  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}
