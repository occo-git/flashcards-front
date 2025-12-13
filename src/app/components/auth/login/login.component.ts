import { Component, ElementRef, ViewChild, ViewEncapsulation, signal } from '@angular/core';
import { NgZone, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { GoogleSingInRequestDto, LoginRequestDto } from '@models/auth.dtos';
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
import { CONST_API_ERRORS, CONST_AUTH } from '@app/services/api.constants';

declare const google: any;

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
    @ViewChild('googleButton', { static: false }) googleButton?: ElementRef<HTMLDivElement>;
    form = new FormGroup(
        {
            username: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(3, 'Username must be at least 3 characters long'),
                CustomValidators.pattern(/^[a-zA-Z0-9._%+-@]+$/, 'Only Latin letters, digits, _ - . % + @ allowed')
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
        private userService: UserService,
        private zone: NgZone
    ) { }

    ngAfterViewInit(): void {
        this.initGoogleSignIn();
    }

    private initGoogleSignIn() {
        if (!this.googleButton) return;

        // GIS init
        google.accounts.id.initialize({
            client_id: CONST_AUTH.GOOGLE_CLIENT_ID,
            callback: (response: any) => {
                this.zone.run(() => this.onGoogleSingIn(response.credential));
            }
        });

        google.accounts.id.renderButton(this.googleButton.nativeElement, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'circle'
        });
    }

    onSubmit() {
        if (this.isLoading()) return;
        this.isLoading.set(true)
        this.errorResponse.set(null);
        this.showReconfirm.set(false);

        if (this.form.valid) {
            const v = this.form.value;
            if (v) {
                const request: LoginRequestDto = {
                    clientId: CONST_AUTH.CLIENT_ID,
                    grantType: CONST_AUTH.GRANT_TYPE_PASSWORD,
                    username: v.username ?? CONST_VALIDATION.DEFAULT_VALUE,
                    password: v.password ?? CONST_VALIDATION.DEFAULT_VALUE
                };
                this.onLogin(request);

            }
        } else {
            console.log('Form is invalid');
        }
    }

    onGoogleSingIn(idToken: string) {
        if (this.isLoading()) return;
        this.isLoading.set(true);
        this.errorResponse.set(null);
        this.showReconfirm.set(false);

        const request: GoogleSingInRequestDto = {
            clientId: CONST_AUTH.CLIENT_ID,
            grantType: CONST_AUTH.GRANT_TYPE_GOOGLE,
            idToken: idToken
        };

        this.onLogin(request);
    }

    onLogin(request: LoginRequestDto | GoogleSingInRequestDto) {
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