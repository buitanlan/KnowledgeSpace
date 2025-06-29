import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (request, next) => {

  const oidcSecurityService = inject(OidcSecurityService);

  if (
      (request.url.includes('/connect/') ||
       request.url.includes('/.well-known/') ||
       request.url.includes('/token'))) {
    console.log('⏭️ SKIPPING Identity Server endpoint:', request.url);
    return next(request);
  }


  // Use reactive approach
  return oidcSecurityService.getAccessToken().pipe(
    switchMap(token => {

      if (token) {
        const authRequest = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          }
        });

        return next(authRequest);
      } else {
        console.error('NO TOKEN - Request will fail with 401');
        return next(request);
      }
    })
  );
};
