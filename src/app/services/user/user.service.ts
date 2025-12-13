import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '@services/user-session/user-session.service';
import { GoogleSingInRequestDto, LoginRequestDto, RegisterRequestDto, TokenResponseDto } from '@models/auth.dtos'
import { DeleteProfileDto, UpdatePasswordDto, UpdateUsernameDto, UserInfoDto } from '@models/user.dtos'
import { CONST_API_PATHS, SKIP_AUTH_CONTEXT } from '@services/api.constants'
import { ConfirmEmailRequestDto, ConfirmEmailResponseDto, SendEmailConfirmationRequestDto, SendEmailConfirmationResponseDto } from '@app/models/email.dtos';

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
            .post<UserInfoDto>(CONST_API_PATHS.AUTH.REGISTER, request, {
                context: SKIP_AUTH_CONTEXT // skip interceptor
            })
    }

    login(request: LoginRequestDto | GoogleSingInRequestDto): Observable<TokenResponseDto> {
        const headers = this.session.getSessionHeaders();
        return this.http
            .post<TokenResponseDto>(CONST_API_PATHS.AUTH.TOKEN, request, {
                headers,
                context: SKIP_AUTH_CONTEXT // skip interceptor
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
            .post<boolean>(CONST_API_PATHS.AUTH.LOGOUT, {})
            .pipe(
                finalize(() => { // in any case
                    this.session.clearCookies();
                    this.userInfo.set(null);
                }));
    }
    //#endregion

    //#region email
    confirmEmail(token: ConfirmEmailRequestDto): Observable<ConfirmEmailResponseDto> {
        return this.http
            .post<ConfirmEmailResponseDto>(CONST_API_PATHS.EMAIL.CONFIRM_EMAIL, token, {
                context: SKIP_AUTH_CONTEXT // skip interceptor
            })
    }
    reSendEmailConfirmation(token: SendEmailConfirmationRequestDto): Observable<SendEmailConfirmationResponseDto> {
        return this.http
            .post<SendEmailConfirmationResponseDto>(CONST_API_PATHS.EMAIL.RESEND_EMAIL_CONFIRMATION, token, {
                context: SKIP_AUTH_CONTEXT // skip interceptor
            })
    }
    //#endregion

    setLevel(level: string) {
        return this.http
            .patch<boolean>(CONST_API_PATHS.USERS.LEVEL, { level })
            .pipe(tap(() => this.loadUser()));
    }

    updateUsername(request: UpdateUsernameDto) {
        return this.http
            .patch(CONST_API_PATHS.USERS.USERNAME, request)
            .pipe(tap(() => this.loadUser()));
    }

    updatePassword(request: UpdatePasswordDto) {
        return this.http
            .patch(CONST_API_PATHS.USERS.PASSWORD, request)
            .pipe(tap(() => this.loadUser()));
    }

    deleteProfile(request: DeleteProfileDto) {
        return this.http
            .patch(CONST_API_PATHS.USERS.DELETE, request)
            .pipe(tap(() => this.loadUser()));
    }
}