import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { UsuarioService } from '@app/_services/usuario.service';
import { Escolaridade } from '@app/_models/escolaridade';
import { Usuario } from '@app/_models/usuario';
import { EscolaridadeService } from '@app/_services/escolaridade.service';
import { UsuarioHistoricoEscolarService } from '@app/_services/usuario-historico-escolar.service';
import { UsuarioHistoricoEscolar } from '@app/_models/usuarioHistoricoEscolar';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    formUsuario!: FormGroup;
    id?: number;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    escolaridadeArray?: Escolaridade[];

    usuario!: Usuario;
    isAddAnexo: boolean = false;
    file?: File = undefined;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private usuarioService: UsuarioService,
        private alertService: AlertService,
        private escolaridadeService: EscolaridadeService,
        private usuarioHistoricoEscolarService: UsuarioHistoricoEscolarService
    ) { 

    }

    ngOnInit(){
        this.LoadData();
    }

    LoadData() {
        this.escolaridadeService.getAll()
        .pipe(map(val => { 
            return (<any>val).data
        }))
        .subscribe(val => { 
            this.escolaridadeArray = val;
        })

        this.id = this.route.snapshot.params['id'];

        if (this.id) 
        {
            this.title = 'Editar Usuário';            

            this.formUsuario = this.formBuilder.group({
                id: ['', Validators.required],
                nome: ['', Validators.required],
                sobrenome: ['', Validators.required],
                email: ['', Validators.required],
                dataNascimento: ['', Validators.required],
                escolaridadeId: ['', Validators.required],
                usuarioHistoricoEscolarNome: [''],
            });
            this.loading = true;
            this.usuarioService
                .getById(this.id)
                .pipe(first())
                .subscribe({
                    next: (x: any) => {
                        x.data.dataNascimento = x.data.dataNascimento.split("T")[0];
                        this.usuario = x.data;
                        this.isAddAnexo = this.usuario.usuarioHistoricoEscolarCollection?.length == 0;

                        this.formUsuario.patchValue(this.usuario);
                        this.loading = false;
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        }
        else
        {
            this.title = 'Adicionar Usuário';
            
            this.formUsuario = this.formBuilder.group({
                nome: ['', Validators.required],
                sobrenome: ['', Validators.required],
                email: ['', Validators.required],
                dataNascimento: ['', Validators.required],
                escolaridadeId: ['', Validators.required]
            });            
        }
    }

    get f() { return this.formUsuario.controls; }

    onSubmit() {
        if (this.formUsuario.invalid) {
            return;
        }

        if (!this.id)
            this.router.navigateByUrl('/usuarios');
        else
            this.LoadData();        
    }

    salvaUsuario() {
        this.submitted = true;

        if (this.formUsuario.invalid) {
            return;
        }

        this.submitting = true;

        this.alertService.clear();
        return (this.id
            ? this.usuarioService.update(this.id!, this.formUsuario.value)
            : this.usuarioService.add(this.formUsuario.value))
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Operação realizada com sucesso', { keepAfterRouteChange: true });
                    this.submitting = false;
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    deleteUsuarioHistoricoEscolar(id: number) {
        this.alertService.clear();
        this.usuarioHistoricoEscolarService.delete(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.usuario.usuarioHistoricoEscolarCollection = this.usuario.usuarioHistoricoEscolarCollection!.filter(x => x.id !== id);
                },
                error: error => {
                    this.alertService.error(error);
                    
                }
            });            
        
    }

    setIsAddAnexo() {
        this.isAddAnexo = !this.isAddAnexo;
        this.file = undefined;
    }

    salvarAnexo() {
        this.alertService.clear();
        this.submitting = true;

        this.usuarioHistoricoEscolarService.enviarAnexo(this.file!, this.formUsuario.value.usuarioHistoricoEscolarNome.toString(), this.id!)
        .pipe(first())
        .subscribe({
            next: () => {
                this.submitting = false;
                this.LoadData();
            },
            error: error => {
                this.submitting = false;
                this.alertService.error(error);
            }
        });    
    }

    onFileSelected(event: any) {
        if (event.target.files.length == 0){
            this.file = undefined;
        }
        else{
            this.file = event.target.files[0];

            let value = this.formUsuario.value;

            value.usuarioHistoricoEscolarNome = this.file?.name;

            this.formUsuario.setValue(value);
        }
    }    

    voltar() {
        this.alertService.clear();
        this.router.navigateByUrl('/usuarios');
    }

    download(usuarioHistoricoEscolar: UsuarioHistoricoEscolar) {
        this.alertService.clear();
        this.usuarioHistoricoEscolarService.obterAnexo(usuarioHistoricoEscolar.anexoId!)
	}
}