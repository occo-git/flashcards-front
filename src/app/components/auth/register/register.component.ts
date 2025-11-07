import { Component, signal, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { RegisterRequestDto } from '@models/auth.dtos'
import { SvgIconComponent } from "@app/components/_common-ui/svg-icon/svg-icon.component";

import { CONST_VALIDATION } from '@validation/validation.constants'
import { CustomValidators } from '@validation/custom-validators';
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

import { CONST_ROUTES } from '@routing/routes.constans';
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, USER_ITEMS } from '@app/components/_common-ui/ui.constants';

@Component({
    selector: 'app-register',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, ErrorMessageDirective, ErrorMessageComponent, SvgIconComponent],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class RegisterComponent {
    form = new FormGroup(
        {
            username: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(8, 'Username must be at least 8 characters long'),
            ]),
            email: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('E-mail is required'),
                CustomValidators.minLength(5, 'E-mail must be at least 5 characters long'),
                CustomValidators.email()
            ]),
            password: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Password is required'),
                CustomValidators.minLength(8, 'Password must be at least 8 characters long'),
                CustomValidators.password()
            ]),
            passwordConfirm: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE)
        },
        {
            validators: CustomValidators.match('password', 'passwordConfirm', 'Passwords must match')
        });

    readonly ICON = SVG_ICON;
    readonly ICONS = ICONS;
    readonly USER_ITEMS = USER_ITEMS;    
    readonly ROUTES = CONST_ROUTES;
    
    isLoading = signal<boolean>(false);
    errorResponse  = signal<HttpErrorResponse | null>(null);
    
    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    onSubmit() {
        this.isLoading.set(true)
        this.errorResponse.set(null);

        if (this.form.valid) {
            const v = this.form.value;
            if (v) {
                const request: RegisterRequestDto = {
                    username: v.username ?? CONST_VALIDATION.DEFAULT_VALUE,
                    email: v.email ?? CONST_VALIDATION.DEFAULT_VALUE,
                    password: v.password ?? CONST_VALIDATION.DEFAULT_VALUE
                };
                this.userService.register(request).subscribe({
                    next: response => {
                        this.isLoading.set(false);
                        this.router.navigate([`/${CONST_ROUTES.AUTH.LOGIN}`]);
                    },
                    error: err => {
                        this.errorResponse.set(null);
                        this.isLoading.set(false);
                    }
                });
            }
        }
    }

    clearError() {
        this.errorResponse.set(null);
        this.isLoading.set(false);
    }
}