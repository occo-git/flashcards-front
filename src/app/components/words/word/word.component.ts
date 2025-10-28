import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { WordDto } from '@models/cards.dto'

@Component({
  selector: 'app-word',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [],
  templateUrl: './word.html',
  styleUrl: './word.scss'
})
export class WordComponent {
  @Input() word!: WordDto;
  @Output() wordClick = new EventEmitter<number>();

  onWordClick() {
    this.wordClick.emit(this.word.id);
  }
}
