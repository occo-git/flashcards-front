import { Component, signal, computed, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, AUTH_ITEMS } from '@app/components/_common-ui/ui.constants';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

import { CONST_ROUTES } from '@routing/routes.constans'

@Component({
    selector: 'app-logout',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ReactiveFormsModule, LoaderComponent, ErrorMessageComponent, SvgIconComponent],
    templateUrl: './logout.html',
    styleUrl: './logout.scss'
})
export class LogoutComponent {
    form = new FormGroup({});
    readonly ICON = SVG_ICON;
    readonly ICONS = ICONS;
    readonly AUTH_ITEMS = AUTH_ITEMS;

    username = computed(() => this.userService.currentUserInfo()?.username);
    isLoading = signal<boolean>(false);
    errorResponse = signal<HttpErrorResponse | null>(null);

    constructor(
        public userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    onSubmit() {
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

    clearError() {
        this.errorResponse.set(null);
        this.isLoading.set(false);
    }
}
