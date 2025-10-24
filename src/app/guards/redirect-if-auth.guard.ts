// src/app/guards/redirect-if-authenticated.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthSessionService } from '@services/auth-session/auth-session.service';
import { CONST_ROUTES } from '@app/routing/routes.constans';

@Injectable({
    providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
    constructor(
        private router: Router,
        private authSessionService: AuthSessionService
    ) {}

    canActivate(): boolean {
        if (this.authSessionService.isAuthenticated()) {
            // Redirect to a default authenticated route if already logged in
            this.router.navigate([`/${CONST_ROUTES.CARDS.CARDS_DECK}`]);
            return false;
        }
        return true; // Allow access to login/register if not authenticated
    }
}