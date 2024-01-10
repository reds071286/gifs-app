import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';



@Injectable({providedIn: 'root'}) //al ponerle provideIn: 'root' hace que el servicio este disponible para toda la aplicacion
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] =[];
  private apiKey: string = '9We69F3Wa1h7KFETEA9sJSSBn2FKLEeq';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';

  //insertamos el servicio de httpclient
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
   }

  get tagsHistory(){
    return [...this._tagsHistory]
  }

  private organizeHistory(tag:string){
    tag=tag.toLowerCase(); //pasamos el tag a minuscula

    //si el elemento existe lo quitamos y ese elemento quitado se convierte en el nuevo arreglo
    if(this._tagsHistory.includes(tag)){
      this._tagsHistory=this._tagsHistory.filter( (oldTag) => oldTag !==tag)
    }

    //ponemos el elemento nuevo al inicio del arreglo
    this._tagsHistory.unshift(tag);

    //mantenemos siempre 10 elementos en el arreglo
    this._tagsHistory=this._tagsHistory.splice(0,10);

    this.saveLocalStorage();
  }


  private saveLocalStorage(): void {
    /* para guardar en el local storage, no es necesario inyectar ninguna dependencia, lo que se requiera guardar
    siempre debe de ser un string, en este ejemplo nos apoyamos con la funcion JSON.stringify para convertir el arreglo de tags
    en un objeto json con string */
    localStorage.setItem('history',JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if(!localStorage.getItem('history')) return;
    this._tagsHistory=JSON.parse(localStorage.getItem('history')!)
    this.searchTag(this._tagsHistory[0]);
  }

  public searchTag(tag: string): void{
    if(tag.length===0) return;
    this.organizeHistory(tag);

    //definimos los parametros de la url para no poner todo el texto en la peticion
    const params = new HttpParams()
      .set('api_key',this.apiKey)
      .set('limit','10')
      .set('q',tag)

    //hacer una peticion get
    /*los metodos http son Genericos, en este caso se le indica <SearchResponse> para que el get
    sepa que regresará un objeto de tipo SearchResponse que se definio como
    interfaz*/
    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
    .subscribe(resp => {
      this.gifList=resp.data;
    })
  }


}
