import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [],
  templateUrl: './svg-icon.html',
  styleUrl: './svg-icon.scss'
})
export class SvgIconComponent {
  @Input() set svg(value: string) {
    this.safePath = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';

  safePath!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  get sizeClass(): string {
    return `svg-icon ${this.size}`;
  }
}