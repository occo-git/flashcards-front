import { Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss'
})
export class ProgressBarComponent {
  @Input({ required: true }) value: number = 0;
  @Input({ required: true }) total: number = 0;
  
  percent = computed(() => {
      if (this.total === 0) return 0;
      return Math.round((this.value / this.total) * 100);
  });
}

