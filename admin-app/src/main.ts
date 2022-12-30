import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from '@environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@app/app.route';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '@app/shared/interceptors/jwt.interceptor';
import { ErrorsInterceptor } from '@app/shared/interceptors/errors.interceptor';

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(AppRoutes)),
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true
    }
  ]
}).catch((err) => console.error(err));
