// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserSessionService } from '@services/user-session/user-session.service';
import { CONST_ROUTES } from '@routing/routes.constans';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private session: UserSessionService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.session.isAuthenticated()) {
            return true; // Allow access if authenticated
        } else {
            // Redirect to login and store the attempted URL for redirecting back after login
            //this.router.navigate([`/${CONST_ROUTES.AUTH.LOGIN}`], { queryParams: { returnUrl: state.url } });
            this.router.navigate([`/${CONST_ROUTES.AUTH.LOGIN}`]);
            return false;
        }
    }
}