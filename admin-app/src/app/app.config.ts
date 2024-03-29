import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from '@app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@app/shared/interceptors/jwt.interceptor';
import { errorInterceptor } from '@app/shared/interceptors/errors.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '@app/shared/services/notification.servive';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([RouterModule.forRoot(appRoutes), BrowserAnimationsModule, ModalModule.forRoot()]),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    MessageService,
    NotificationService,
    ConfirmationService,
    DatePipe
  ]
};
