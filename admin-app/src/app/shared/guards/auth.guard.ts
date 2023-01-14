import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of, tap } from 'rxjs';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return of(authService.isAuthenticated()).pipe(
    tap((value) =>
      !value
        ? router.navigate(['/login'], { queryParams: { redirect: router.routerState.snapshot.url }, replaceUrl: true })
        : true
    )
  );
};
