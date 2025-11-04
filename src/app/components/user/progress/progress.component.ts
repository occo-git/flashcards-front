import { Component, ViewEncapsulation } from '@angular/core';
import { SVG_ICON } from '@app/components/svg-icon.constants';
import { SvgIconComponent } from "@app/components/_common-ui/svg-icon/svg-icon.component";

@Component({
  selector: 'app-progress',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [SvgIconComponent],
  templateUrl: './progress.html',
  styleUrl: './progress.scss'
})
export class ProgressComponent {

  readonly ICON = SVG_ICON;

}
