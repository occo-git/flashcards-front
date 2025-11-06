import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { SvgIconComponent } from "../../svg-icon/svg-icon.component";
import { SVG_ICON } from '@app/components/svg-icon.constants';
import { WordDto, ActivityResultDto } from '@app/models/cards.dto';
import { FillBlankDto } from '@app/models/activity.dto';

@Component({
  selector: 'app-word-results',
  imports: [SvgIconComponent],
  templateUrl: './word-results.html',
  styleUrl: './word-results.scss'
})
export class WordResultsComponent {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;

  readonly SPLITER = '____';
  ICON = SVG_ICON;
  results = signal<ActivityResultDto[]>([]);

  scrollToBottom(): void {
    setTimeout(() => {
      const el = this.resultsContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }

  addWordResult(word: WordDto, isOk: boolean) {
    if (word) {
      const activityResult: ActivityResultDto = {
        isOk: isOk,
        wordId: word.id,
        textParts: [{ text: `${word.wordText} - ${word.translation.ru}`, isBold: false }]
      };
      this.addResult(activityResult);
    }
  }

  addFillBlankRusult(fillBlankTemplate: string, word: WordDto, isOk: boolean) {
    if (fillBlankTemplate && word) {

      const parts = fillBlankTemplate.split(this.SPLITER);
      if (parts.length !== 2) return;     

      const activityResult: ActivityResultDto = {
        isOk: isOk,
        wordId: word.id,
        textParts: [
          { text: parts[0], isBold: false },
          { text: word.wordText, isBold: true },
          { text: parts[1], isBold: false }
        ] //.filter(part => part.text !== '')
      };
      this.addResult(activityResult);
    }
  }

  private addResult(activityResult: ActivityResultDto) {
    this.results.update(prev => [...prev, activityResult]);
    this.scrollToBottom();
  }
}