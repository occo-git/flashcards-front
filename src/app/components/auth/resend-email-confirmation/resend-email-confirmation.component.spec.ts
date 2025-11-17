import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsendendEmailConfirmationComponent } from './resend-email-confirmation.component';

describe('LoginComponent', () => {
  let component: RsendendEmailConfirmationComponent;
  let fixture: ComponentFixture<RsendendEmailConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsendendEmailConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsendendEmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
