import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { UserSessionService } from '@services/user-session/user-session.service';
import { CONST_ROUTES } from '@routing/routes.constans';
import { SKIP_AUTH } from '@services/api.constants';

export const AppHttpInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const router = inject(Router);
  const userService = inject(UserService);
  const session = inject(UserSessionService);

return session.getHeaders().pipe(
    switchMap(headers => next(req.clone({ headers }))),
    catchError(err => {
      if (err.status === 401) {
        // logout and redirect to Login page
        userService.logout();
        router.navigate([`/${CONST_ROUTES.AUTH.LOGIN}`]);
      }
      return throwError(() => err);
    })
  );
};