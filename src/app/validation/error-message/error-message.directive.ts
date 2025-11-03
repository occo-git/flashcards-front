import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appErrorMessage]'
})
export class ErrorMessageDirective implements OnInit, OnDestroy {
  @Input() errorElement: HTMLElement | undefined; // Reference to the .error div
  private statusSubscription: Subscription | undefined = undefined;

  constructor(private control: NgControl, private el: ElementRef) { }

  ngOnInit() {
    this.statusSubscription = this.control.statusChanges?.subscribe(() => {
      const control = this.control.control;
      if (control?.invalid && (control.touched || control.dirty)) {
        this.showError();
      } else {
        this.removeError();
      }
    });
  }

  private showError() {
    if (!this.errorElement)
      return;

    this.removeError(); // Clear any existing error message
    const errors = this.control.errors;
    if (errors) {
      const firstError = Object.keys(errors)[0];
      let errorMessage = errors[firstError]?.message || 'Invalid input';
      this.errorElement.textContent = errorMessage;
    }
  }

  private removeError() {
    if (this.errorElement) {
      this.errorElement.textContent = '';
    }
  }
  
  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }
}