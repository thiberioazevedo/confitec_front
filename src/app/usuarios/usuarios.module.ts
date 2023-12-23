import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsuariosRoutingModule,
        NgxPaginationModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
    ]
})
export class UsuariosModule { }