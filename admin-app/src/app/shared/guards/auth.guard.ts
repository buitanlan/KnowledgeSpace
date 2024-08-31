import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of, tap } from 'rxjs';
import { SystemConstants } from '@app/protected-zone/systems/constants/systems.constant';

export const authGuard= (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return of(authService.isAuthenticated()).pipe(
    tap((value) => {
      if (value) {
        const functionCode = route.data['functionCode'] as string;
        const permissions = JSON.parse(authService.getProfile()?.['permissions']! as string) as string[];
        if (permissions && permissions.filter(x => x === functionCode + '_' + SystemConstants.VIEW_ACTION).length > 0) {
          return true;
        } else {
          router.navigate(['/access-denied'], {
            queryParams: { redirect: state.url }
          });
          return false;
        }
      }
      else {
        router.navigate(['/login'], { queryParams: { redirect: state.url }, replaceUrl: true });
        return false;
      }

    }
  ));
};
