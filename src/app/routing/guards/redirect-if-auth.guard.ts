// src/app/guards/redirect-if-authenticated.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserSessionService } from '@services/user-session/user-session.service';
import { CONST_ROUTES } from '@routing/routes.constans';

@Injectable({
    providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
    constructor(
        private router: Router,
        private session: UserSessionService
    ) {}

    canActivate(): boolean {
        if (this.session.isAuthenticated()) {
            // Redirect to a default authenticated route if already logged in
            this.router.navigate([`/${CONST_ROUTES.CARDS.CARDS_DECK}`]);
            return false;
        }
        return true; // Allow access to login/register if not authenticated
    }
}