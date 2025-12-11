import { Component, signal, computed, ViewEncapsulation } from '@angular/core';
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

@Component({
    selector: 'app-profile',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, LoaderComponent, ErrorMessageDirective, ErrorMessageComponent, SvgIconComponent],
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
            ])
        });
    formPasswordReset = new FormGroup(
        {
            password: new FormControl(
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
            profileUsername: new FormControl(
                CONST_VALIDATION.DEFAULT_VALUE, [
                CustomValidators.required('Username is required'),
                CustomValidators.minLength(8, 'Username must be at least 8 characters long'),
            ])
        });
    readonly ICON = SVG_ICON;
    readonly ICONS = ICONS;
    readonly AUTH_ITEMS = AUTH_ITEMS;
    readonly USER_ITEMS = USER_ITEMS;


    showPassword = signal<boolean>(false);
    username = computed(() => this.userService.currentUserInfo()?.username);
    isLoading = signal<boolean>(false);
    errorResponse = signal<HttpErrorResponse | null>(null);

    constructor(
        public userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    onUsernameChange() {

    }

    onPasswordReset() {

    }

    onLogout() {
        this.errorResponse.set(null);
        this.isLoading.set(true);

        this.userService.logout().subscribe({
            next: b => {
                this.isLoading.set(false);
                if (b)
                    this.router.navigate([`/${CONST_ROUTES.AUTH.LOGIN}`]);
            },
            error: err => {
                this.errorResponse.set(err);
                this.isLoading.set(false);
            }
        });
    }

    onDeleteProfile() {
        
    }

    togglePasswordVisibility() {
        this.showPassword.set(!this.showPassword());
    }

    clearError() {
        this.errorResponse.set(null);
        this.isLoading.set(false);
    }
}
