import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from '@app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@app/shared/interceptors/jwt.interceptor';
import { errorInterceptor } from '@app/shared/interceptors/errors.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([RouterModule.forRoot(appRoutes), BrowserAnimationsModule, BsModalRef]),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ]
};
