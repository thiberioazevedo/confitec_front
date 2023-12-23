import { BaseModel } from "./baseModel";
import { Escolaridade } from "./escolaridade";

export class UsuarioHistoricoEscolar extends BaseModel {
    constructor(
        public id?: number,
        public nome?: string,
        public usuarioId?: string,
        public anexoId?: number){
        super();
    }
}