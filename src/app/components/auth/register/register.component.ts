import { Component, computed, signal, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { RegisterRequestDto } from '@models/auth.dtos'
import { UserInfoDto } from '@app/models/user.dtos';
import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";

import { CONST_VALIDATION } from '@validation/validation.constants'
import { CustomValidators } from '@validation/custom-validators';
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

import { CONST_ROUTES } from '@routing/routes.constans';
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, AUTH_ITEMS, EMAIL_ITEMS } from '@components/_common-ui/ui.constants';

@Component({
    selector: 'app-register',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, LoaderComponent, ErrorMessageDirective, ErrorMessageComponent, SvgIconComponent],
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
    readonly AUTH_ITEMS = AUTH_ITEMS;
    readonly EMAIL_ITEMS = EMAIL_ITEMS;
    readonly ROUTES = CONST_ROUTES;

    showPassword = signal<boolean>(false);
    user = signal<UserInfoDto | null>(null);
    isRegistered = computed(() => this.user() !== null);
    username = computed(() => this.user()?.username ?? '');
    isLoading = signal<boolean>(false);
    errorResponse = signal<HttpErrorResponse | null>(null);

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    onSubmit() {
        if (this.isLoading()) return;

        this.user.set(null);
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
                    next: user => {
                        this.isLoading.set(false);
                        this.user.set(user);
                    },
                    error: err => {
                        this.errorResponse.set(err);
                        this.isLoading.set(false);
                    }
                });
            }
        }
    }

    togglePasswordVisibility() {
        this.showPassword.set(!this.showPassword());
    }

    clearError() {
        this.errorResponse.set(null);
        this.isLoading.set(false);
    }
}