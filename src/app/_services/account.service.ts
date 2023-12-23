import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { BaseService, StorangeEnum } from './base.service';

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseService<User> {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        httpClient: HttpClient,
    ) {
        super(httpClient);
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(StorangeEnum.session.toString())!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.httpClient.post<User>(`${environment.apiUrl}/v2/account/login`, { email: username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem(StorangeEnum.session.toString(), JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem(StorangeEnum.session.toString());
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.httpClient.post(`${environment.apiUrl}/v2/account/register`, { email: user.username, password: user.password, confirmPassword: user.password});
    }

    getAll() {
        // return this.httpClient.get<User[]>(`${environment.apiUrl}/v2/account`);
        return this.get('/v2/account')
    }

    getById(id: any) {
        return this.httpClient.get<User>(`${environment.apiUrl}/v2/account/${id}`);
    }

    update(id: string, params: any) {
        return this.httpClient.put(`${environment.apiUrl}/v2/account/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem(StorangeEnum.session.toString(), JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    override delete(id: any) {
    return this.httpClient.delete(`${environment.apiUrl}/v2/account/${id}`)
    .pipe(map(x => {
    // auto logout if the logged in user deleted their own record
    if (id == this.userValue?.id) {
    this.logout();
    }
                return x;
    }));
    }
}