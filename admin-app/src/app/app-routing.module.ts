import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/shared/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./protected-zone/proted-zone.module').then((m) => m.ProtectedZoneModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule)
    },
    {
        path: 'access-denied',
        loadChildren: () => import('./access-denied/access-denied.module').then((m) => m.AccessDeniedModule)
    },
    {
        path: 'auth-callback',
        loadChildren: () => import('./auth-callback/auth-callback.module').then((m) => m.AuthCallbackModule)
    },
    {
        path: 'error',
        loadChildren: () => import('./server-error/server-error.module').then((m) => m.ServerErrorModule)
    },

    {
        path: 'not-found',
        loadChildren: () => import('./not-found/not-found.module').then((m) => m.NotFoundModule)
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
