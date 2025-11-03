import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { HttpClient, HttpContext } from '@angular/common/http';
import { UserSessionService } from '@services/user-session/user-session.service';
import { RegisterRequestDto, LoginRequestDto, TokenResponseDto } from '@models/auth.dtos'
import { UserInfoDto } from '@models/user.dtos'
import { CONST_API_PATHS, SKIP_AUTH } from '@services/api.constants'

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly LEVEL_KEY = 'userLevel';
    private userInfo = signal<UserInfoDto | null>(null);
    private loading = signal<boolean>(false);

    get currentUserInfo() { return this.userInfo.asReadonly(); }
    userLevel = computed(() => {
        const currentLevel = this.currentUserInfo()?.level;
        if (currentLevel) return currentLevel;
        return localStorage.getItem(this.LEVEL_KEY);
    });
    get isLoading() { return this.loading.asReadonly(); }

    constructor(
        private http: HttpClient,
        private session: UserSessionService
    ) {
        this.init();
    }

    //#region init
    private init(): void {
        if (this.session.isAuthenticated()) {
            this.loadUser();
        } else {
            this.loading.set(false);
        }
    }

    private loadUser(): void {
        this.loading.set(true);
        this.me().subscribe({
            next: (user) => {
                this.userInfo.set(user);
                localStorage.setItem(this.LEVEL_KEY, user.level);
                this.loading.set(false);
            },
            error: (err) => {
                this.userInfo.set(null);
                localStorage.removeItem(this.LEVEL_KEY);
                this.loading.set(false);
            }
        });
    }

    private me(): Observable<UserInfoDto> {
        return this.http
            .get<UserInfoDto>(CONST_API_PATHS.USERS.ME);
    }
    //#endregion

    //#region register, login, logout
    register(request: RegisterRequestDto): Observable<UserInfoDto> {
        return this.http
            .post<UserInfoDto>(CONST_API_PATHS.USERS.REGISTER, request, {
                context: new HttpContext().set(SKIP_AUTH, true) // skip interceptor
            })
    }

    login(request: LoginRequestDto): Observable<TokenResponseDto> {
        const headers = this.session.getSessionHeaders();
        return this.http
            .post<TokenResponseDto>(CONST_API_PATHS.USERS.LOGIN, request, {
                headers,
                context: new HttpContext().set(SKIP_AUTH, true) // skip interceptor
            })
            .pipe(
                tap(tokens => {
                    this.session.saveLoginResponse(tokens);
                    this.loadUser();
                })
            );
    }

    logout(): Observable<boolean> {
        return this.http
            .post<boolean>(CONST_API_PATHS.USERS.LOGOUT, {})
            .pipe(
                finalize(() => { // in any case
                    this.session.clear();
                    this.userInfo.set(null);
                }));
    }
    //#endregion

    setLevel(level: string) {
        return this.http
            .post<boolean>(CONST_API_PATHS.USERS.LEVEL, { level })
            .pipe(tap(() => this.loadUser()));
    }
}