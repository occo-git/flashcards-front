import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { CONST_ROUTES } from '@routing/routes.constans'

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-logout',
    standalone: true,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [ErrorMessageComponent],
    templateUrl: './logout.html',
    styleUrl: './logout.scss'
})
export class LogoutComponent {
    username: string = '';
    errorResponse: HttpErrorResponse | null = null;
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {
        authService.me().subscribe({
            next: response => {
                this.username = response.username;
                this.cdr.detectChanges();
            },
            error: err => {
                this.errorResponse = err;
                this.cdr.detectChanges();
            }
        });
    }

    onSubmit() {
        this.authService.logout().subscribe({
            next: b => {
                if (b)
                    this.router.navigate([`/${CONST_ROUTES.AUTH.LOGIN}`]);
            },
            error: err => {
                this.errorResponse = err;
                this.cdr.detectChanges();
            }
        });
    }

    clearError() {
        this.errorResponse = null;
    }
}
