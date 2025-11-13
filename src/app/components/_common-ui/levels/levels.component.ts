import { Component, signal, computed } from '@angular/core';
import { FilterService } from '@app/services/filter/filter.service';
import { UserService } from '@services/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SvgIconComponent } from "../svg-icon/svg-icon.component";
import { SVG_ICON } from '@app/components/svg-icon.constants';

@Component({
  selector: 'app-levels',
  //imports: [LoaderComponent],
  templateUrl: './levels.html',
  styleUrl: './levels.scss',
  imports: [SvgIconComponent]
})
export class LevelsComponent {

  readonly ICON = SVG_ICON;
  levels = computed(() => this.filterService.levelsSignal());
  reversedLevels = computed(() => this.levels().slice().reverse());
  userLevel = computed(() => this.userService.currentUserInfo()?.level);
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private filterService: FilterService,
    public userService: UserService
  ) {
    this.init();
  }

  private init() {
    this.isLoading.set(true);
    this.errorResponse.set(null);

    this.filterService.getLevels().subscribe({
      next: levels => {
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