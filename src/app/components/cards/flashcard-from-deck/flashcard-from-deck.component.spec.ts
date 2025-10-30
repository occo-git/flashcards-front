import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardFromDeckComponent } from './flashcard-from-deck.component';

describe('FlashcardFromDeckComponent', () => {
  let component: FlashcardFromDeckComponent;
  let fixture: ComponentFixture<FlashcardFromDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardFromDeckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashcardFromDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
