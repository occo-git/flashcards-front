// src/app/guards/redirect-if-authenticated.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            // Redirect to a default authenticated route if already logged in
            this.router.navigate(['/quiz']);
            return false;
        }
        return true; // Allow access to login/register if not authenticated
    }
}