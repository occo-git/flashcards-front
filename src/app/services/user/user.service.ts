import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '@services/user-session/user-session.service';
import { RegisterRequestDto, LoginRequestDto, TokenResponseDto } from '@models/auth.dtos'
import { UserInfoDto } from '@models/user.dtos'
import { CONST_API_PATHS } from '@services/api.constants'

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
        return this.session.getHeaders().pipe(
            switchMap(headers =>
                this.http.get<UserInfoDto>(CONST_API_PATHS.USERS.ME, { headers })
            ));
    }
    //#endregion

    //#region register, login, logout
    register(request: RegisterRequestDto): Observable<UserInfoDto> {
        return this.http
            .post<UserInfoDto>(CONST_API_PATHS.USERS.REGISTER, request)
    }

    login(request: LoginRequestDto): Observable<TokenResponseDto> {
        const headers = this.session.getLoginHeaders();
        return this.http
            .post<TokenResponseDto>(CONST_API_PATHS.USERS.LOGIN, request, { headers })
            .pipe(
                tap(tokens => {
                    this.session.saveLoginResponse(tokens);
                    this.loadUser();
                })
            );
    }

    logout(): Observable<boolean> {
        return this.session.getHeaders().pipe(
            switchMap(headers => {
                this.session.clear();
                this.userInfo.set(null);
                return this.http.post<boolean>(CONST_API_PATHS.USERS.LOGOUT, {}, { headers });
            }));
    }
    //#endregion

    setLevel(level: string) {
        return this.session.getHeaders().pipe(
            switchMap(headers => {
                return this.http.post<boolean>(CONST_API_PATHS.USERS.LEVEL, { level }, { headers })
                    .pipe(tap(() => this.loadUser()))
            })
        )
    }
}