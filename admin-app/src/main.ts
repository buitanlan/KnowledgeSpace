/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from '@environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from '@app/app.route';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@app/shared/interceptors/jwt.interceptor';
import { errorInterceptor } from '@app/shared/interceptors/errors.interceptor';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([RouterModule.forRoot(appRoutes), BrowserAnimationsModule, BsModalRef]),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ]
}).catch(console.error);
