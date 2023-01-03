import { Routes } from '@angular/router';
import { FunctionsComponent } from './functions/functions.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'functions',
    component: FunctionsComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  },
  {
    path: 'permissions',
    component: PermissionsComponent
  },
  {
    path: '',
    component: UsersComponent
  }
];
