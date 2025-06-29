import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SystemConstants } from '@app/protected-zone/systems/constants/systems.constant';

export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const oidcSecurityService = inject(OidcSecurityService);

  return oidcSecurityService.isAuthenticated$.pipe(
    switchMap(({ isAuthenticated }) => {

      if (!isAuthenticated) {
        console.log('Auth Guard - Not authenticated, redirecting to login');
        router.navigate(['/login'], {
          queryParams: { redirect: state.url },
          replaceUrl: true
        });
        return of(false);
      }

      // Check permissions if functionCode is specified
      const functionCode = route.data['functionCode'] as string;

      if (!functionCode) {
        console.log('Auth Guard - No functionCode required, allowing access');
        return of(true);
      }

      // Get user data to check permissions
      return oidcSecurityService.getUserData().pipe(
        map((userData) => {
          console.log('Auth Guard - User data:', userData);

          if (!userData) {
            console.log('Auth Guard - No user data, denying access');
            router.navigate(['/access-denied'], {
              queryParams: { redirect: state.url }
            });
            return false;
          }

          // Check if user has permissions
          if (userData['permissions']) {
            const permissions = JSON.parse(userData['permissions'] as string) as string[];
            const requiredPermission = functionCode + '_' + SystemConstants.VIEW_ACTION;
            const hasPermission = permissions.includes(requiredPermission);


            if (!hasPermission) {
              router.navigate(['/access-denied'], {
                queryParams: { redirect: state.url }
              });
              return false;
            }
          } else {
            console.log('Auth Guard - No permissions in user data, allowing access (TEMP DEBUG)');
            return true;
          }

          return true;
        })
      );
    })
  );
};
