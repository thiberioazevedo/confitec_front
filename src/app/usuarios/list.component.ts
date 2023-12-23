import { Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { UsuarioService } from '@app/_services/usuario.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    usuarios?: any[];

    constructor(private usuarioService: UsuarioService, private alertService: AlertService) {}

    ngOnInit() {
        this.usuarioService.getAll()
        .pipe(map(val => { 
            return (<any>val).data
        }))
        .subscribe(val => { 
            this.usuarios = val;
        })
    }

    deleteUser(id: number) {
        const user = this.usuarios!.find(x => x.id === id);
        user.isDeleting = true;
        this.usuarioService.delete(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.usuarios = this.usuarios!.filter(x => x.id !== id);
                    user.isDeleting = false;
                },
                error: error => {
                    this.alertService.error(error);
                    user.isDeleting = false;
                }
            });             
    }
}