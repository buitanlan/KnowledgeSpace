import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { ErrorsInterceptor } from '@app/shared/interceptors/errors.interceptor';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        NgbModule
    ],
    declarations: [AppComponent],
    providers: [
        AuthGuard,
        {
            provide:HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorsInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
