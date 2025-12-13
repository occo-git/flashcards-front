import { Component, signal, computed, ViewEncapsulation, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, AUTH_ITEMS, USER_ITEMS } from '@app/components/_common-ui/ui.constants';

import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

import { CONST_ROUTES } from '@routing/routes.constans'
import { CONST_VALIDATION } from '@app/validation/validation.constants';
import { CustomValidators } from '@app/validation/custom-validators';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { CONST_API_ERRORS, CONST_AUTH } from '@app/services/api.constants';
import { UpdatePasswordDto, UpdateUsernameDto } from '@app/models/user.dtos';

@Component({
    selector: 'app-profile',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, LoaderComponent, ErrorMessageDirective, ErrorMessageComponent, SvgIconComponent, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
})
export class ProfileComponent {
    formNewUsernameSave = new FormGroup(
        {
            newUsername: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(8, 'Username must be at least 8 characters long'),
                CustomValidators.pattern(/^[a-zA-Z0-9_-]+$/, 'Latin letters, digits, _ - only')
            ])
        });
    formNewPasswordSave = new FormGroup(
        {
            oldPassword: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Password is required'),
                CustomValidators.minLength(8, 'Password must be at least 8 characters long'),
                CustomValidators.password()
            ]),
            newPassword: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Password is required'),
                CustomValidators.minLength(8, 'Password must be at least 8 characters long'),
                CustomValidators.password()
            ])
        });
    formDeleteProfile = new FormGroup(
        {
            profilePassword: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Password is required'),
                CustomValidators.minLength(8, 'Password must be at least 8 characters long'),
                CustomValidators.password()
            ]),
        });
    readonly ICON = SVG_ICON;
    readonly ICONS = ICONS;
    readonly AUTH_ITEMS = AUTH_ITEMS;
    readonly USER_ITEMS = USER_ITEMS;
    readonly CONST_AUTH = CONST_AUTH;

    username = computed(() => this.userService.currentUserInfo()?.username);
    email = computed(() => this.userService.currentUserInfo()?.email);
    provider = computed(() => this.userService.currentUserInfo()?.provider);

    isLoading = signal<boolean>(false);
    errorResponse = signal<HttpErrorResponse | null>(null);


    constructor(
        public userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        effect(() => {
            const usernameValue = this.username();
            this.formNewUsernameSave.patchValue({ newUsername: usernameValue });
        });
    }

    onNewUsernameSave() {
        if (this.isLoading()) return;
        this.isLoading.set(true)
        this.errorResponse.set(null);

        if (this.formNewUsernameSave.valid) {
            const v = this.formNewUsernameSave.value;
            if (v) {
                const request: UpdateUsernameDto = {
                    newUsername: v.newUsername ?? CONST_VALIDATION.DEFAULT_VALUE
                };
                this.userService.updateUsername(request).subscribe({
                    next: response => {
                        this.isLoading.set(false);
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
        }
    }

    onNewPasswordSave() {
        if (this.isLoading()) return;
        this.isLoading.set(true)
        this.errorResponse.set(null);

        if (this.formNewPasswordSave.valid) {
            const v = this.formNewPasswordSave.value;
            if (v) {
                const request: UpdatePasswordDto = {
                    oldPassword: v.oldPassword ?? CONST_VALIDATION.DEFAULT_VALUE,
                    newPassword: v.newPassword ?? CONST_VALIDATION.DEFAULT_VALUE
                };
                this.userService.updatePassword(request).subscribe({
                    next: response => {
                        this.isLoading.set(false);
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
        }
    }

    onDeleteProfile() {
        //this.router.navigate([`/${CONST_ROUTES.CARDS.CARDS_DECK}`]);
    }

    //#region show password
    showUsernamePassword = signal<boolean>(false);
    showOldPassword = signal<boolean>(false);
    showProfilePassword = signal<boolean>(false);

    toggleUsernamePasswordVisibility() { this.showUsernamePassword.set(!this.showUsernamePassword()); }
    toggleOldPasswordVisibility() { this.showOldPassword.set(!this.showOldPassword()); }
    toggleProfilePasswordVisibility() { this.showProfilePassword.set(!this.showProfilePassword()); }
    //#endregion

    private handleErrorCode(errorCode: string) {
        switch (errorCode) {
            case CONST_API_ERRORS.AUTH.EMAIL_NOT_CONFIRMED: // email not confirmed, cannot login
                // ...
        }
    }

    clearError() {
        this.errorResponse.set(null);
        this.isLoading.set(false);
    }
}
