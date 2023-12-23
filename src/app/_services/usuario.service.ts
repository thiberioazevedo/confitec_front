import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Usuario } from '@app/_models/usuario';
import { BaseService, StorangeEnum } from './base.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService extends BaseService<Usuario> {
    private usuarioSubject: BehaviorSubject<Usuario | null>;
    public usuario: Observable<Usuario | null>;

    constructor(
        private router: Router,
        httpClient: HttpClient,
    ) {
        super(httpClient);
        this.usuarioSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(StorangeEnum.session.toString())!));
        this.usuario = this.usuarioSubject.asObservable();
    }

    public get userValue() {
        return this.usuarioSubject.value;
    }

    add(params: any) {
        return this.post('/v1/usuario', {... params})
    }

    getAll() {
        return this.get('/v1/usuario')
    }

    getById(id: any) {
        return this.get(`/v1/usuario/${id}`)
        //return this.httpClient.get<Usuario>(`${environment.apiUrl}/v1/usuario/${id}`);
    }

    update(id: number, params: any) {
        return this.put(`/v1/usuario/${id}`, {... params})
            .pipe(map(x => {
                return x;
            }));
    }

    override delete(id: any) {
        return super.delete(id);
    }
}