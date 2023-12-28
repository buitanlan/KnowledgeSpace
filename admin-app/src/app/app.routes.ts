import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./protected-zone/protected-zone.route').then((m) => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.route').then((m) => m.routes)
  },
  {
    path: 'access-denied',
    loadChildren: () => import('./access-denied/access-denied.route').then((m) => m.routes)
  },
  {
    path: 'auth-callback',
    loadChildren: () => import('./auth-callback/auth-callback.route').then((m) => m.routes)
  },
  {
    path: 'error',
    loadChildren: () => import('./server-error/server-error.route').then((m) => m.routes)
  },

  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.route').then((m) => m.routes)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];
