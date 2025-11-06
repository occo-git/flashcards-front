import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordResultsComponent } from './word-results.component';

describe('WordResultsComponent', () => {
  let component: WordResultsComponent;
  let fixture: ComponentFixture<WordResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
