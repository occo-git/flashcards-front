import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { WordDto } from '@models/cards.dto'
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';

@Component({
  selector: 'app-word',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [SvgIconComponent],
  templateUrl: './word.html',
  styleUrl: './word.scss'
})
export class WordComponent {
  @Input() word!: WordDto;
  @Output() wordClick = new EventEmitter<number>();

  ICON = SVG_ICON;

  onWordClick() {
    this.wordClick.emit(this.word.id);
  }
}
