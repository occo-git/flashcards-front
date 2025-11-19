import { Component, ElementRef, ViewChild, ViewEncapsulation, computed, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { SendEmailConfirmationRequestDto, SendEmailConfirmationResponseDto } from '@models/email.dtos';
import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";

import { CONST_VALIDATION } from '@validation/validation.constants'
import { CustomValidators } from '@validation/custom-validators';
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

import { CONST_ROUTES } from '@routing/routes.constans'
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, EMAIL_ITEMS } from '@components/_common-ui/ui.constants';

@Component({
    selector: 'app-resend-email-confirmation',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, LoaderComponent, ErrorMessageDirective, ErrorMessageComponent, SvgIconComponent],
    templateUrl: './resend-email-confirmation.html',
    styleUrl: './resend-email-confirmation.scss'
})
export class RsendendEmailConfirmationComponent {
    @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
    form = new FormGroup(
        {
            email: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('E-mail is required'),
                CustomValidators.minLength(5, 'E-mail must be at least 5 characters long'),
                CustomValidators.email()
            ]),
        })

    readonly ICON = SVG_ICON;
    readonly ICONS = ICONS;
    readonly EMAIL_ITEMS = EMAIL_ITEMS;
    readonly ROUTES = CONST_ROUTES;

    showReconfirm = signal<boolean>(false);
    showPassword = signal<boolean>(false);
    result = signal<SendEmailConfirmationResponseDto | null>(null);

    isLoading = signal<boolean>(false);
    errorResponse = signal<HttpErrorResponse | null>(null);

    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    onSubmit() {
        if (this.isLoading()) return;
        this.result.set(null);
        this.errorResponse.set(null);
        this.isLoading.set(true);

        if (this.form.valid) {
            const v = this.form.value;
            if (v) {
                const request: SendEmailConfirmationRequestDto = {
                    email: v.email ?? CONST_VALIDATION.DEFAULT_VALUE,
                };

                this.userService.reSendEmailConfirmation(request).subscribe({
                    next: response => {
                        this.result.set(response);
                        this.isLoading.set(false);
                    },
                    error: err => {
                        this.errorResponse.set(err);
                        this.isLoading.set(false);
                    }
                });
            }
        } else {
            console.log('Form is invalid');
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