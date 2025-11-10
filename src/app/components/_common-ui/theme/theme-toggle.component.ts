import { Component } from '@angular/core';
import { ThemeService } from '@services/theme/theme.service';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';
import { THEMES } from 'constants';

@Component({
  selector: 'app-theme-toggle',
  imports: [SvgIconComponent],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss'
})
export class ThemeToggleComponent {
  THEMES = THEMES;
  ICON = SVG_ICON;

  constructor(
    public themeService: ThemeService
  ) {}
}