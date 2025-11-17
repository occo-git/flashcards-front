import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoundToggleComponent } from './sound-toggle.component';

describe('ThemeComponent', () => {
  let component: SoundToggleComponent;
  let fixture: ComponentFixture<SoundToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});