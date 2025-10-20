import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillBlankComponent } from './fill-blank.component';

describe('FillBlankComponent', () => {
  let component: FillBlankComponent;
  let fixture: ComponentFixture<FillBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillBlankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
