import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { DEFAULT_VALUE, MIN_REGEX } from '@validation/validation-constants'
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { CustomValidators } from '@validation/custom-validators';

@Component({
    selector: 'app-login',
    standalone: true,
    //encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, ErrorMessageDirective],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent {
    form = new FormGroup(
        {
            username: new FormControl(
                DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(3, 'Username must be at least 3 characters long'),
            ]),
            password: new FormControl(
                DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(8, 'Password must be at least 8 characters long'),
                CustomValidators.pattern(MIN_REGEX, 'Password must contain at least one letter and one number')
            ]),
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
            this.form.markAllAsTouched(); // Отмечаем все поля как touched, чтобы показать ошибки
        }
    }
}