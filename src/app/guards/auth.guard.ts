// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isAuthenticated()) {
            return true; // Allow access if authenticated
        } else {
            // Redirect to login and store the attempted URL for redirecting back after login
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}