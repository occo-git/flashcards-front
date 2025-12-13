import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { CONST_VALIDATION } from '@validation/validation.constants';

// Pre-configured validators with custom messages
export const CustomValidators = {
  required: (message: string = 'This field cannot be empty') =>
    withErrorMessage(Validators.required, 'required', message),

  minLength: (length: number, message: string) =>
    withErrorMessage(Validators.minLength(length), 'minlength', message),
  
  pattern: (pattern: string | RegExp, message: string) =>
    withErrorMessage(Validators.pattern(pattern), 'pattern', message),
  
  email: (message: string = 'Please enter a valid email address') =>
    withErrorMessage(Validators.email, 'email', message),

  password: (message: string = 'Password must contain at least one letter and one number') =>
    withErrorMessage(Validators.pattern(CONST_VALIDATION.MIN_REGEX), 'pattern', message),

  match: (controlName1: string, controlName2: string, message: string) =>
    matchControlValues(controlName1, controlName2, message)
};

// Validator to check if two fields match
function matchControlValues(controlName1: string, controlName2: string, message: string): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const control1 = formGroup.get(controlName1);
    const control2 = formGroup.get(controlName2);

    if (!control1 || !control2)
      return null;

    if (control1.value !== control2.value) {
      // Set error on control2
      control2.setErrors({ match: { message } });
      return { match: { message } };
    } else {
      // Clear match error if present
      if (control2.hasError('match')) {
        const errors = { ...control2.errors };
        delete errors['match'];
        control2.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  };
}

// Wraps a validator to include a custom error message
function withErrorMessage(validator: ValidatorFn, errorKey: string, message: string): ValidatorFn {
  return (control: AbstractControl) => {
    const result = validator(control);
    if (result) {
      return { [errorKey]: { ...result[errorKey], message } };
    }
    return null;
  };
}