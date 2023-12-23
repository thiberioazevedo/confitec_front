import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { BaseService, StorangeEnum } from './base.service';
import { UsuarioHistoricoEscolar } from '@app/_models/usuarioHistoricoEscolar';

@Injectable({ providedIn: 'root' })
export class UsuarioHistoricoEscolarService extends BaseService<UsuarioHistoricoEscolar> {
    private usuarioHistoricoEscolarSubject: BehaviorSubject<UsuarioHistoricoEscolar | null>;
    public usuarioHistoricoEscolar: Observable<UsuarioHistoricoEscolar | null>;

    constructor(
        private router: Router,
        httpClient: HttpClient,
    ) {
        super(httpClient);
        this.usuarioHistoricoEscolarSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(StorangeEnum.session.toString())!));
        this.usuarioHistoricoEscolar = this.usuarioHistoricoEscolarSubject.asObservable();
    }

    public get userValue() {
        return this.usuarioHistoricoEscolarSubject.value;
    }

    add(params: any) {
        return this.post('/v1/usuarioHistoricoEscolar', {... params})
    }

    getAll() {
        return this.get('/v1/usuarioHistoricoEscolar')
    }

    getById(id: any) {
        return this.get(`/v1/usuarioHistoricoEscolar/${id}`)
        //return this.httpClient.get<usuarioHistoricoEscolar>(`${environment.apiUrl}/v1/usuario/${id}`);
    }

    update(id: number, params: any) {
        return this.put(`/v1/usuarioHistoricoEscolar/${id}`, {... params})
            .pipe(map(x => {
                return x;
            }));
    }


    override delete(id: any) {
        return super.delete(id);
    }
}