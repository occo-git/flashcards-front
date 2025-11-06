import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankResultsComponent } from './blank-results.component';

describe('BlankResultsComponent', () => {
  let component: BlankResultsComponent;
  let fixture: ComponentFixture<BlankResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlankResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlankResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
