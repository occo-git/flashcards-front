import { Component, signal, computed, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { CONST_ROUTES } from '@routing/routes.constans'

import { LoaderComponent } from '@components/_common-ui/loader/loader.component';
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-logout',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [LoaderComponent, ErrorMessageComponent],
    templateUrl: './logout.html',
    styleUrl: './logout.scss'
})
export class LogoutComponent {

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
