import { Component, ViewEncapsulation } from '@angular/core';
import { WordComponent } from '../word/word.component';

@Component({
  selector: 'app-word-list',
  standalone: true,  
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [WordComponent],
  templateUrl: './word-list.html',
  styleUrl: './word-list.scss'
})
export class WordListComponent {

}
