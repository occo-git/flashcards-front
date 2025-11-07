import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss'
})
export class ProgressBarComponent {
  @Input({ required: true }) percent: number = 0;
  
}
