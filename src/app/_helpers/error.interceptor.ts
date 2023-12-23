import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.accountService.userValue) {
                // auto logout if 401 or 403 response returned from api
                this.accountService.logout();
            }

            let error : any = undefined;
            if (err?.error?.errors)
                Object.keys(err.error.errors).map((val: any)=> error = `${error ?  error + '<br>' : ''}${err.error.errors[val]} `)
            else
                error = err.message || err.error?.message || err.statusText;

            console.error(err);
            return throwError(() => error);
        }))
    }
}