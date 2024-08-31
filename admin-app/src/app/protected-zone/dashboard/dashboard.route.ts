import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { authGuard } from '@app/shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      functionCode: 'Dashboard'
    },
    canActivate: [authGuard]
  }
];
