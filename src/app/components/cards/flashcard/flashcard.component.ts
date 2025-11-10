import { Component, Input, signal, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { FileService } from '@services/files/file.service';
import { CardDto } from '@models/cards.dto';
import { LoaderComponent } from "@components/_common-ui/loader/loader.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [LoaderComponent, SvgIconComponent],
  templateUrl: './flashcard.html',
  styleUrls: ['./flashcard.scss']
})
export class FlashcardComponent implements OnInit, OnChanges {
  @Input() card: CardDto | undefined;

  ICON = SVG_ICON;
  imageUrl = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  showTranslation = signal(false);

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    if (this.card)
      this.loadImage(this.card.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['card']) {
      if (this.card)
        this.loadImage(this.card.id);
      else
        this.imageUrl.set(null);
    }
  }

  toggleTranslation() {
    this.showTranslation.update(value => !value);
  }

  loadImage(id: number): void {
    this.isLoading.set(false);
    this.fileService.getImage(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imageUrl.set(url);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
      }
    });
  }
}