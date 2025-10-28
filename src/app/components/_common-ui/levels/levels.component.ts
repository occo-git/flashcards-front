import { Component, signal, computed } from '@angular/core';
import { FlashcardService } from '@app/services/flashcard/flashcard.service';
import { UserService } from '@app/services/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-levels',
  //imports: [LoaderComponent],
  templateUrl: './levels.html',
  styleUrl: './levels.scss'
})
export class LevelsComponent {

  constructor(
    private flashcardService: FlashcardService,
    public userService: UserService
  ) {
    this.init();
  }

  userLevel = computed(() => this.userService.currentUserInfo()?.level);

  levels = signal<string[]>([]);
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  private init() {
    this.isLoading.set(true);
    this.errorResponse.set(null);

    this.flashcardService.getLevels().subscribe({
      next: response => {
        this.levels.set(response);
        this.isLoading.set(false);
        this.errorResponse.set(null);
      },
      error: err => {
        this.isLoading.set(false);
        this.errorResponse.set(err);
      }
    });
  }

  onLevelSelected(level: string) {
    if (level === this.userLevel()) return;

    this.isLoading.set(true);
    this.errorResponse.set(null);

    this.userService.setLevel(level).subscribe({
      next: response => {
        this.isLoading.set(false);
      },
      error: err => {
        this.isLoading.set(false);
        this.errorResponse.set(err);
      }
    })
  }
}