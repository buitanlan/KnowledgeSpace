import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/shared/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  request = request.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Authorization: `${authService.authorizationHeaderValue}`
    }
  });
  return next(request);
};
