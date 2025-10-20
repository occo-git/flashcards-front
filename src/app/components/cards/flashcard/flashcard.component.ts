import { Component, Input, signal, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Flashcard } from '@models/flashcard.interface';
import { FileService } from '@services/files/file.service';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [],
  templateUrl: './flashcard.html',
  styleUrls: ['./flashcard.scss']
})
export class FlashcardComponent implements OnInit, OnChanges {
  @Input() flashcard!: Flashcard;

  showTranslation = signal(false);
  imageUrl = signal<string | null>(null); // Сигнал для хранения URL изображения

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
    this.fileService.getImage(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imageUrl.set(url); // Обновляем сигнал с новым URL изображения
      },
      error: (error) => {
        console.error('Error fetching the image:', error);
      }
    });
  }
}