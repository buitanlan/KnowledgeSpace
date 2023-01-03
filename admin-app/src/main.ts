import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from '@environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@app/app.route';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@app/shared/interceptors/jwt.interceptor';
import { errorInterceptor } from '@app/shared/interceptors/errors.interceptor';

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(AppRoutes)),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    AuthGuard
  ]
}).catch((err) => console.error(err));
