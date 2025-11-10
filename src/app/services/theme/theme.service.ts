import { effect, Injectable, signal } from '@angular/core';
import { THEMES } from 'constants';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<string>(THEMES.LIGHT);
  currentTheme = this.theme.asReadonly();

  constructor() {
    const saved = localStorage.getItem('app-theme') as string | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(saved ?? (prefersDark ? THEMES.DARK : THEMES.LIGHT));
    
    effect(() => {
      const theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('app-theme', theme);
    });
  }

  toggle() {
    this.theme.update(t => t === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  }
}