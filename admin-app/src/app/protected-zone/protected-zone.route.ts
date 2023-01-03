import { Routes } from '@angular/router';
import { ProtectedZoneComponent } from './protected-zone.component';

export const routes: Routes = [
  {
    path: '',
    component: ProtectedZoneComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.route').then((m) => m.routes)
      },
      {
        path: 'contents',
        loadChildren: () => import('./contents/contents.route').then((m) => m.routes)
      },
      {
        path: 'systems',
        loadChildren: () => import('./systems/systems.route').then((m) => m.routes)
      },
      {
        path: 'statistics',
        loadChildren: () => import('./statistics/statistics.route').then((m) => m.routes)
      }
    ]
  }
];
