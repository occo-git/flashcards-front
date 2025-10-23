import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthSessionService } from '@services/auth-session/auth-session.service';

import { environment } from '@env/environment'
import { RegisterUserDto, LoginUserDto, UserInfoDto } from '@models/user/user.dtos'

const urlRegister: string = `${environment.apiUrl}/users/register`;
const urlLogin: string = `${environment.apiUrl}/users/login`;
const urlMe: string = `${environment.apiUrl}/users/me`;
const urlLogout: string = `${environment.apiUrl}/users/logout`;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private httpClient: HttpClient,
        private authSessionService: AuthSessionService
    ) {}

    // Example: Check if user is authenticated (e.g., by checking a token in localStorage)
    isAuthenticated(): boolean {
        // Replace with your actual authentication logic (e.g., check JWT token)
        return !!localStorage.getItem('authToken'); // Example: Returns true if token exists
    }

    register(request: RegisterUserDto): Observable<UserInfoDto> {
        return this.httpClient.post<UserInfoDto>(urlRegister, request);
    }

    login(request: LoginUserDto): Observable<UserInfoDto> {
        return this.httpClient.post<UserInfoDto>(urlLogin, request)
    }

    // Example logout method
    logout(): void {
        localStorage.removeItem('authToken');
    }
}