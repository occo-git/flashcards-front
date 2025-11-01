import { Component, ViewEncapsulation } from '@angular/core';
import { LevelsComponent } from "@components/_common-ui/levels/levels.component";

@Component({
  selector: 'app-change-level',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [LevelsComponent],
  templateUrl: './change-level.html',
  styleUrl: './change-level.scss'
})
export class ChangeLevelComponent {

}
