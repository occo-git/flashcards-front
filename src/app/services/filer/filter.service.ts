import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { Observable, tap, map } from 'rxjs';
import { BookmarkDto, DeckFilterDto, LevelDto, LevelFilterDto, ThemeDto, TranslationDto } from '@models/cards.dto';
import { CONST_API_PATHS } from '@services/api.constants';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private levels = signal<LevelDto[]>([]);
  private themes = signal<ThemeDto[]>([]);
  private bookmarks = signal<BookmarkDto[]>([
    { id: 0, isAll: true, name: '• All' },
    { id: 1, isAll: false, name: 'Marked' },
    { id: -1, isAll: false, name: 'Unmarked' }
  ]);
  get levelsSignal() { return this.levels.asReadonly(); }
  get themesSignal() { return this.themes.asReadonly(); }
  get bookmarksSignal() { return this.bookmarks.asReadonly(); }

  selectedThemeId = signal<number>(0);
  selectedBookmarkId = signal<number>(0);
  selectedDifficultyId = signal<number>(0);

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getLevels(): Observable<LevelDto[]> {
    return this.http.get<LevelDto[]>(CONST_API_PATHS.CARDS.LEVELS)
      .pipe(
        tap(response => this.levels.set(response)) // save signal
      );
  }

  getThemes(): Observable<ThemeDto[]> {
    const request: LevelFilterDto = {
      level: this.userService.userLevel()!
    }

    return this.http.post<ThemeDto[]>(CONST_API_PATHS.CARDS.THEMES, request)
      .pipe(
        map(response => {
          // themes 'All' item
          const allTheme: ThemeDto = {
            id: 0,
            level: request.level,
            isAll: true,
            translation: { 'en': '• All', 'ru': '' } as TranslationDto,
            wordsCount: 0
          };

          return [allTheme, ...response];
        }),
        tap(themesWithAll => {
          this.themes.set(themesWithAll); // сохраняем в сигнал
        })
      );
  }

  applyFilterParams(params: Params) {
    const bookmarkId = +params['bookmarkId'] || 0;
    const themeId = +params['themeId'] || 0;
    const difficultyId = +params['difficultyId'] || 0;
    this.selectedBookmarkId.set(bookmarkId);
    this.selectedThemeId.set(themeId);
    this.selectedDifficultyId.set(difficultyId);
  }

  applyFilter(filter: DeckFilterDto) {
    this.selectedBookmarkId.set(filter.isMarked);
    this.selectedThemeId.set(filter.themeId);
    this.selectedDifficultyId.set(filter.difficulty);
  }

  getFilter(): DeckFilterDto {
    return {
      level: this.userService.userLevel()!,
      isMarked: this.selectedBookmarkId(),
      themeId: this.selectedThemeId(),
      difficulty: this.selectedDifficultyId()
    };
  }
}
