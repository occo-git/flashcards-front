import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { AuthSessionService } from '@services/auth-session/auth-session.service';
import { RegisterRequestDto, LoginRequestDto, TokenResponseDto } from '@app/models/auth.dtos'
import { UserInfoDto } from '@app/models/user.dtos'
import { environment } from '@env/environment'

const urlRegister: string = `${environment.apiUrl}/users/register`;
const urlLogin: string = `${environment.apiUrl}/users/login`;
const urlMe: string = `${environment.apiUrl}/users/me`;
const urlLogout: string = `${environment.apiUrl}/users/logout`;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private session: AuthSessionService
    ) { }

    register(request: RegisterRequestDto): Observable<UserInfoDto> {
        return this.http
            .post<UserInfoDto>(urlRegister, request)
        //.pipe(catchError(this.handleError));
    }

    login(request: LoginRequestDto): Observable<TokenResponseDto> {
        const headers = this.session.getLoginHeaders();
        return this.http
            .post<TokenResponseDto>(urlLogin, request, { headers: headers })
            .pipe(
                tap(response => this.session.saveLoginResponse(response))
            );
    }

    me(): Observable<UserInfoDto> {
        return this.session.getHeaders().pipe(
            switchMap(headers => 
                this.http.get<UserInfoDto>(urlMe, { headers: headers })
            ));
    }

    logout(): Observable<boolean> {
        return this.session.getHeaders().pipe(
            switchMap(headers => {
                this.session.clear();
                return this.http.post<boolean>(urlLogout, {}, { headers: headers });
      }));
    }
}