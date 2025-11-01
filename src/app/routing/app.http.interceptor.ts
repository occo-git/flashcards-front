import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router, ROUTES } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { CONST_ROUTES } from '@routing/routes.constans';

export const AppHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userService = inject(UserService);

  return next(req).pipe(
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