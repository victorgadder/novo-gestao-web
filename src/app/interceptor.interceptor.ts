import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './shared/services/auth/auth.service';
import { catchError, switchMap, take, throwError } from 'rxjs';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const accessToken = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();

    if (accessToken) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    } else {
        if (accessToken && refreshToken) {
          const refreshData = {
              accessToken,
              refreshToken
          };
              
          return authService.postRefresh(refreshData).pipe(
              take(1),
              switchMap((newToken: any) => {
                  localStorage.setItem('accessToken', newToken.token);
                  req = req.clone({
                      setHeaders: {
                        Authorization: `Bearer ${newToken.token}`
                      }
                  });

                  return next(req);
              }),
              catchError(err => {
                return throwError(err);
              })
          );
      }
      catchError(err => {
        return throwError(err);
    })
    }
    return next(req);
};