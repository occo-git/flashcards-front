import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '@app/services/user-session/user-session.service';
import { RegisterRequestDto, LoginRequestDto, TokenResponseDto } from '@app/models/auth.dtos'
import { UserInfoDto, LevelRequestDto } from '@app/models/user.dtos'
import { CONST_API_PATHS } from '@services/api.constants'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    currentUserInfo = signal<UserInfoDto | null>(null);
    isLoading = signal<boolean>(false);

    constructor(
        private http: HttpClient,
        private session: UserSessionService
    ) {
        this.init();
    }

    private init(): void {
        if (this.session.isAuthenticated()) {
            this.loadUser();
        } else {
            this.isLoading.set(false);
        }
    }

    private loadUser(): void {
        this.isLoading.set(true);
        this.me().subscribe({
            next: (user) => {
                this.currentUserInfo.set(user);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.currentUserInfo.set(null);
                this.isLoading.set(false);
            }
        });
    }

    register(request: RegisterRequestDto): Observable<UserInfoDto> {
        return this.http
            .post<UserInfoDto>(CONST_API_PATHS.USERS.REGISTER, request)
        //.pipe(catchError(this.handleError));
    }

    login(request: LoginRequestDto): Observable<TokenResponseDto> {
        const headers = this.session.getLoginHeaders();
        return this.http
            .post<TokenResponseDto>(CONST_API_PATHS.USERS.LOGIN, request, { headers })
            .pipe(
                tap(response => {
                    this.session.saveLoginResponse(response);
                    this.loadUser();
                })
            );
    }

    me(): Observable<UserInfoDto> {
        return this.session.getHeaders().pipe(
            switchMap(headers =>
                this.http.get<UserInfoDto>(CONST_API_PATHS.USERS.ME, { headers })
                    .pipe(
                        tap(response => this.currentUserInfo.set(response))
                    )
            ));
    }

    logout(): Observable<boolean> {
        return this.session.getHeaders().pipe(
            switchMap(headers => {
                this.session.clear();
                this.currentUserInfo.set(null);
                return this.http.post<boolean>(CONST_API_PATHS.USERS.LOGOUT, {}, { headers });
            }));
    }

    setLevel(level: string) {
        return this.session.getHeaders().pipe(
            switchMap(headers => {
                return this.http.post<boolean>(CONST_API_PATHS.USERS.LEVEL, { level}, { headers })
                .pipe(
                    tap(() => this.loadUser())
                )
            })
        )
    }
}