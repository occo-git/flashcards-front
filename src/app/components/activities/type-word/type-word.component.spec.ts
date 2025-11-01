import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeWordComponent } from './type-word.component';

describe('TypeWordComponent', () => {
  let component: TypeWordComponent;
  let fixture: ComponentFixture<TypeWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeWordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
