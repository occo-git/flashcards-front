import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeLevelComponent } from './change-level.component';

describe('ChangeLevel', () => {
  let component: ChangeLevelComponent;
  let fixture: ComponentFixture<ChangeLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
