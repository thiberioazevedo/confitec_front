import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';1
import { environment } from '@environments/environment';
import { Escolaridade } from '@app/_models/escolaridade';
import { BaseService, StorangeEnum } from './base.service';

@Injectable({ providedIn: 'root' })
export class EscolaridadeService extends BaseService<Escolaridade> {
    private escolaridadeSubject: BehaviorSubject<Escolaridade | null>;
    public escolaridade: Observable<Escolaridade | null>;

    constructor(
        private router: Router,
        httpClient: HttpClient,
    ) {
        super(httpClient);
        this.escolaridadeSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(StorangeEnum.session.toString())!));
        this.escolaridade = this.escolaridadeSubject.asObservable();
    }

    public get userValue() {
        return this.escolaridadeSubject.value;
    }

    register(user: Escolaridade) {
        return this.httpClient.post(`${environment.apiUrl}/v1/escolaridade`, {})
    }

    getAll() {
        return this.get('/v1/escolaridade')
    }

    getById(id: any) {
        return this.httpClient.get<Escolaridade>(`${environment.apiUrl}/v1/escolaridade/${id}`);
    }

    update(id: number, params: any) {
        return this.put(`/v1/escolaridade/${id}`, {... params})
            .pipe(map(x => {
                return x;
            }));
    }

    override delete(id: any) {
        return this.httpClient.delete(`${environment.apiUrl}/v1/escolaridade/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }
}