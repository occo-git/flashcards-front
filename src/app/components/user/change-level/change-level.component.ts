import { Component, ViewEncapsulation } from '@angular/core';
import { LevelsComponent } from "@components/_common-ui/levels/levels.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, USER_ITEMS } from '@components/_common-ui/ui.constants';

@Component({
  selector: 'app-change-level',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [LevelsComponent, SvgIconComponent],
  templateUrl: './change-level.html',
  styleUrl: './change-level.scss'
})
export class ChangeLevelComponent {

  readonly ICON = SVG_ICON;
  readonly ICONS = ICONS;
  readonly USER_ITEMS = USER_ITEMS;

}