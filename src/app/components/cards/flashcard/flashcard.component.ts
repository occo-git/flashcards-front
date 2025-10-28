import { Component, Input, signal, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FlashcardDto } from '@app/models/cards.dto';
import { FileService } from '@services/files/file.service';
import { LoaderComponent } from "@app/components/_common-ui/loader/loader.component";

@Component({
  selector: 'app-flashcard',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [LoaderComponent],
  templateUrl: './flashcard.html',
  styleUrls: ['./flashcard.scss']
})
export class FlashcardComponent implements OnInit, OnChanges {
  @Input() flashcard!: FlashcardDto;

  imageUrl = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  showTranslation = signal(false);

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadImage(this.flashcard.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flashcard']) {
      this.loadImage(this.flashcard.id); // Обновляем изображение при изменении карточки
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