import { Component, ElementRef, ViewChild, ViewEncapsulation, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { LoginRequestDto } from '@models/auth.dtos';
import { LoaderComponent } from "@app/components/_common-ui/loader/loader.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";

import { CONST_VALIDATION } from '@validation/validation.constants'
import { CustomValidators } from '@validation/custom-validators';
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

import { CONST_ROUTES } from '@routing/routes.constans'
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, AUTH_ITEMS } from '@components/_common-ui/ui.constants';
import { CONST_API_ERRORS } from '@app/services/api.constants';

@Component({
    selector: 'app-login',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, LoaderComponent, ErrorMessageDirective, ErrorMessageComponent, SvgIconComponent],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent {
    @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
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

    readonly ICON = SVG_ICON;
    readonly ICONS = ICONS;
    readonly AUTH_ITEMS = AUTH_ITEMS;
    readonly ROUTES = CONST_ROUTES;

    showPassword = signal<boolean>(false);
    showReconfirm = signal<boolean>(false);

    isLoading = signal<boolean>(false);
    errorResponse = signal<HttpErrorResponse | null>(null);

    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    onSubmit() {
        if (this.isLoading()) return;
        this.isLoading.set(true)
        this.errorResponse.set(null);
        this.showReconfirm.set(false);

        if (this.form.valid) {
            const v = this.form.value;
            if (v) {
                const request: LoginRequestDto = {
                    username: v.username ?? CONST_VALIDATION.DEFAULT_VALUE,
                    password: v.password ?? CONST_VALIDATION.DEFAULT_VALUE
                };

                this.userService.login(request).subscribe({
                    next: response => {
                        this.isLoading.set(false);
                        this.router.navigate([`/${CONST_ROUTES.CARDS.CARDS_DECK}`]);
                    },
                    error: err => {
                        const errorCode = err?.error?.ErrorCode;
                        if (errorCode)
                            this.handleErrorCode(errorCode);

                        this.errorResponse.set(err);
                        this.isLoading.set(false);
                    }
                });
            }
        } else {
            console.log('Form is invalid');
        }
    }

    private handleErrorCode(errorCode: string) {
        switch (errorCode) {
            case CONST_API_ERRORS.AUTH.EMAIL_NOT_CONFIRMED: // email not confirmed, cannot login
                this.showReconfirm.set(true);
        }
    }

    togglePasswordVisibility() {
        this.showPassword.set(!this.showPassword());
        this.passwordInput.nativeElement.focus();
    }

    clearError() {
        this.errorResponse.set(null);
        this.isLoading.set(false);
    }
}