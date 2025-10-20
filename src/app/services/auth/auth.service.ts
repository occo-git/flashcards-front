import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Example: Check if user is authenticated (e.g., by checking a token in localStorage)
    isAuthenticated(): boolean {
        // Replace with your actual authentication logic (e.g., check JWT token)
        return !!localStorage.getItem('authToken'); // Example: Returns true if token exists
    }

    // Example login method
    login(credentials: { username: string, password: string }): boolean {
        // Replace with real authentication logic (e.g., API call)
        if (credentials.username === 'user' && credentials.password === 'pass') {
            localStorage.setItem('authToken', 'sample-token');
            return true;
        }
        return false;
    }

    // Example logout method
    logout(): void {
        localStorage.removeItem('authToken');
    }
}