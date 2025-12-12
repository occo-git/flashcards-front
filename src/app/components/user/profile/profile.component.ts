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
import { CONST_AUTH } from '@app/services/api.constants';

@Component({
    selector: 'app-profile',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, LoaderComponent, ErrorMessageDirective, ErrorMessageComponent, SvgIconComponent, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
})
export class ProfileComponent {
    formUsernameChange = new FormGroup(
        {
            newUsername: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(8, 'Username must be at least 8 characters long'),
            ]),
            usernamePassword: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Password is required'),
                CustomValidators.minLength(8, 'Password must be at least 8 characters long'),
                CustomValidators.password()
            ]),
        });
    formPasswordReset = new FormGroup(
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
            this.formUsernameChange.patchValue({ newUsername: usernameValue });
        });
    }

    onUsernameChange() {

    }

    onPasswordReset() {

    }

    onDeleteProfile() {

    }

    //#region show password
    showUsernamePassword = signal<boolean>(false);
    showOldPassword = signal<boolean>(false);
    showProfilePassword = signal<boolean>(false);

    toggleUsernamePasswordVisibility() { this.showUsernamePassword.set(!this.showUsernamePassword()); }
    toggleOldPasswordVisibility() { this.showOldPassword.set(!this.showOldPassword()); }
    toggleProfilePasswordVisibility() { this.showProfilePassword.set(!this.showProfilePassword()); }
    //#endregion

    clearError() {
        this.errorResponse.set(null);
        this.isLoading.set(false);
    }
}
