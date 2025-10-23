import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '@services/auth/auth.service';
import { AuthSessionService } from '@services/auth-session/auth-session.service';
import { LoginUserDto, UserInfoDto } from '@models/user/user.dtos';

import { CONST_VALIDATION } from '@app/validation/validation.constants'
import { CustomValidators } from '@validation/custom-validators';
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, ErrorMessageDirective, ErrorMessageComponent],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent {
    form = new FormGroup(
        {
            username: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(3, 'Username must be at least 3 characters long'),
            ]),
            password: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(8, 'Password must be at least 8 characters long'),
                CustomValidators.pattern(CONST_VALIDATION.MIN_REGEX, 'Password must contain at least one letter and one number')
            ]),
        })
    errorResponse: HttpErrorResponse | null = null;
    isLoading = false;

    constructor(
        private authService: AuthService,
        private authSessionService: AuthSessionService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    onSubmit() {

        if (this.form.valid) {
            //console.log('Form is valid:', this.form.value);
            const v = this.form.value;
            if (v) {
                const request: LoginUserDto = {
                    username: v.username ?? CONST_VALIDATION.DEFAULT_VALUE,
                    password: v.password ?? CONST_VALIDATION.DEFAULT_VALUE
                };
                this.authService.login(request).subscribe({
                    next: (response) => {
                        this.isLoading = false;
                        console.log('Success:', response);
                        this.authSessionService.setTokens(response.accessToken, response.refreshToken);
                    },
                    error: (err) => {
                        this.isLoading = false;
                        this.errorResponse = err;
                        this.cdr.detectChanges();
                    }
                });
            }
        } else {
            console.log('Form is invalid');
        }
    }
    
    clearError() {
        this.errorResponse = null;
    }
}