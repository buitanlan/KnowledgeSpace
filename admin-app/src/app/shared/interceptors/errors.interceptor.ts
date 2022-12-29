import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, retry, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(retry(1), catchError(this.handleErrors));
  }
  handleErrors(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const applicationError = error.headers.get('Application-Error');

      // either application-error in header or model error in body
      if (applicationError) {
        return throwError(() => applicationError);
      }

      let modelStateErrors = '';

      // for now just concatenate the error descriptions, alternative we could simply pass the entire error response upstream
      for (const key in error.error) {
        if (error.error[key]) {
          modelStateErrors += error.error[key].description + '\n';
        }
      }

      modelStateErrors = modelStateErrors === '' ? 'Server error' : modelStateErrors;
      return throwError(() => modelStateErrors);
    }
    console.log('error', errorMessage);
    return throwError(() => errorMessage);
  }
}
