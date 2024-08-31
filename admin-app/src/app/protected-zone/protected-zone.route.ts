import { Routes } from '@angular/router';
import { ProtectedZoneComponent } from './protected-zone.component';
import { authGuard } from '@app/shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ProtectedZoneComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.route').then((m) => m.routes),
        data: {
          functionCode: 'Dashboard'
        },
        canActivate: [authGuard]
      },
      {
        path: 'contents',
        loadChildren: () => import('./contents/contents.route').then((m) => m.routes),
        data: {
          functionCode: 'Content'
        },
        canActivate: [authGuard]
      },
      {
        path: 'systems',
        loadChildren: () => import('./systems/systems.route').then((m) => m.routes),
        data: {
          functionCode: 'System'
        },
        canActivate: [authGuard]
      },
      {
        path: 'statistics',
        loadChildren: () => import('./statistics/statistics.route').then((m) => m.routes),
        data: {
          functionCode: 'Statistic'
        },
        canActivate: [authGuard]
      }
    ]
  }
];
