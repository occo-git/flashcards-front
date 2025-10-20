import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { DEFAULT_VALUE, MIN_REGEX } from '@validation/validation-constants'
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { CustomValidators } from '@validation/custom-validators';

@Component({
    selector: 'app-register',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, ErrorMessageDirective],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class RegisterComponent {

    form = new FormGroup(
        {
            username: new FormControl(
                DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(8, 'Username must be at least 8 characters long'),
            ]),
            email: new FormControl(
                DEFAULT_VALUE, [
                CustomValidators.required('E-mail is required'),
                CustomValidators.minLength(5, 'E-mail must be at least 5 characters long'),
                CustomValidators.email()
            ]),
            password: new FormControl(
                DEFAULT_VALUE, [
                CustomValidators.required('Password is required'),
                CustomValidators.minLength(8, 'Password must be at least 8 characters long'),
                CustomValidators.pattern(MIN_REGEX, 'Password must contain at least one letter and one number')
            ]),
            passwordConfirm: new FormControl(
                DEFAULT_VALUE)
        },
        { 
            validators: CustomValidators.match('password', 'passwordConfirm', 'Passwords must match') 
        })

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit() {
        if (this.form.valid) {
            console.log('Form is valid:', this.form.value);
            // Например, вызов authService.login
        } else {
            console.log('Form is invalid');
        }
    }
}
