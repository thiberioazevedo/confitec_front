// import { StorangeEnum } from './../enums/storange.enum';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import * as saveAs from 'file-saver';
import { Observable, map } from 'rxjs';

export enum Ambiente {
  Desenvolvimento = 0,
  Homologacao = 1,
  Producao = 2,
  DevLocal = 3,
  DevLocalIAM = 4
}


export enum StorangeEnum {
    session,
    refreshTokenIam,
    tokenIam,
    c0
}
export interface IExportService<T> {
  obterRegistrosExportarExcel(filtro: any, includes: string): Promise<T[]>;
}

export interface IHistoricoAnimalService {
  obterHistoricoAnimal(idEntrada: number, termo: string, pagina: number, registrosPorPagina: number, paramExtra?: string): Promise<any>;
}

export abstract class BaseService<T> {

  public ambiente = '';
  private restEndpoint = '';
  protected iamEndpointToken = '';
  protected iamEndpointTokenInfo = '';
  protected iamEndpointUserInfo = '';
  protected iamEndpointRefreshToken = '';
  protected clientIdBk = '';
  protected clientId = '';
  protected clientSecret = '';

  protected get UrlService() {
    return this.restEndpoint;
  }

  constructor(public httpClient: HttpClient) {
  }

   protected endpoint: string = '';

  protected ObterHeaderJson() {
    const data = (<any>JSON.parse( localStorage.getItem(StorangeEnum.session.toString()) || '')).data;
    let headers: any  = {'Content-Type': 'application/json'}
      headers = {
        ...headers,
        'Authorization': 'Bearer ' + data.accessToken,
        'x-r-t':data.refreshToken,

      }
    return new HttpHeaders(headers);
  }
  get Token(): string{
    let token = (localStorage.getItem(StorangeEnum.tokenIam.toString()));
    if(token === 'null')
      token = null;
    return <string>token;
  }

  protected get(endpoint: string) {
    return this.httpClient.get(`${environment.apiUrl}${endpoint}`, { headers: this.ObterHeaderJson() });
  }

  protected getAsArrayOfType(endpoint: string) {
    return this.httpClient.get<T[]>(`${environment.apiUrl}${endpoint}`, { headers: this.ObterHeaderJson() });
  }

  protected post(endpoint: string, body: T | T[]) {
    return this.httpClient.post(`${environment.apiUrl}${endpoint}`, body, { headers: this.ObterHeaderJson() });
  }

  protected genericPost<Ttype>(endpoint: string, body: Ttype) {
    return this.httpClient.post(`${environment.apiUrl}${endpoint}`, body, { headers: this.ObterHeaderJson() });
  }

  protected put(endpoint: string, body: T | T[]) {
    return this.httpClient.put(`${environment.apiUrl}${endpoint}`, body, { headers: this.ObterHeaderJson() });
  }

  protected delete(id: any) {
    let url = `${environment.apiUrl}/v1/${this.nomeClasse()}/${id}`;
    return this.httpClient.delete(url, { headers: this.ObterHeaderJson() });
  }

  nomeClasse(){
    let classe = this.constructor.name;
    classe = classe.substring(0, classe.length - 7);
    return classe;
  }

  protected postList(endpoint: string, body: T[]) {
    return this.httpClient.post(`${environment.apiUrl}${endpoint}`, body, { headers: this.ObterHeaderJson() });
  }

  protected postById(endpoint: string, id: number) {
    return this.httpClient.post(`${environment.apiUrl}${endpoint}?id=${id}`, id, { headers: this.ObterHeaderJson() });
  }

  public enviarAnexo (file: File, nome: string, id: number, versao: number = 1) 
  {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('nome', nome);
      formData.append('id', id.toString());

      const headers = this.ObterHeaderJson().delete('Content-Type');
      let url = `${environment.apiUrl}/v${versao}/${this.nomeClasse()}/enviar-anexo`;

      return this.httpClient.post(url, formData, { headers: headers }).pipe(map(x => {return x;}));      
  }

  obterAnexo(id: number, versao: number = 1) {
    const headers = this.ObterHeaderJson();
    let url = `${environment.apiUrl}/v${versao}/${this.nomeClasse()}/obter-anexo/${id}`;

    this.httpClient.get(url, {  observe: 'response', responseType: 'blob', headers: headers})
    
    .subscribe((response: any) => {
      let contentDisposition : string = (response.headers.get('content-disposition').toString())!;
      let arquivo = contentDisposition.split(';')
                                      .find(i => i.toString().includes("filename="))!
                                      .split('=')[1]
                                      .toString()

      while ((arquivo).includes('"'))
        arquivo = arquivo.replace('"','')

      while ((arquivo).includes("'"))
        arquivo = arquivo.replace("'", "")        

      saveAs(response.body, arquivo) ;
    });
  }
}
