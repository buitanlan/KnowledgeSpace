import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(retry(1), catchError(handleErrors));
};
const handleErrors = (error: HttpErrorResponse) => {
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
  console.error('error', errorMessage);
  return throwError(() => errorMessage);
};
