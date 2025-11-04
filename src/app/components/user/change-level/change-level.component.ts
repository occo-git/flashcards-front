import { Component, ViewEncapsulation } from '@angular/core';
import { LevelsComponent } from "@components/_common-ui/levels/levels.component";
import { SvgIconComponent } from "@app/components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@app/components/svg-icon.constants';

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

}