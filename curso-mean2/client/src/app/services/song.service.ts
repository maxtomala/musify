import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Song } from '../models/song';

@Injectable()
export class SongService {
    public identity: any;

    url: string;
    token: any;
    id: any;
  
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getSongs(token: any, albumId = null): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        const options = { headers: headers }; // Crear un objeto de opciones con las cabeceras
        
        if(albumId==null){
            return this._http.get(this.url + '/songs/' , options)
            .pipe(map((res: any) => res));
        }else{
            return this._http.get(this.url + '/songs/'+albumId , options)
            .pipe(map((res: any) => res));
        }
    }




    getSong(token: any, id: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        const options = { headers: headers }; // Crear un objeto de opciones con las cabeceras
        return this._http.get(this.url + '/song/' + id, options)
            .pipe(map((res: any) => res));
    
    }

   

    addSong(token: any, song: Song): Observable<any> { //va a recibir un token y objeto album: y es el que guarda en bd
        
        // let idAlbum =album._id
        let params = JSON.stringify(song);             //convierte album a string json
        let headers = new HttpHeaders({                 //controla si cuando envias el token es correcta al idenficacion y permite acceder o no
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + '/song/', params, { headers: headers }) // enviar una peticion por post+ruta album parametro : las cosas q tiene q guardar(e nuevo bjeto o inf a guardar)
            .pipe(map((res: any) => res));
    }
   
    editSong(token: any, id: string, song: Song): Observable<any> { //va a recibir un token y objeto album: y es el que guarda en bd
        
       
        let params = JSON.stringify(song);             //convierte album a string json
        let headers = new HttpHeaders({                 //controla si cuando envias el token es correcta al idenficacion y permite acceder o no
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + '/song/'+id, params, { headers: headers }) // enviar una peticion por post+ruta album parametro : las cosas q tiene q guardar(e nuevo bjeto o inf a guardar)
            .pipe(map((res: any) => res));
    }

    deleteSong(token: any, id: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        const options = { headers: headers }; // Crear un objeto de opciones con las cabeceras
        return this._http.delete(this.url + '/song/' + id, options)
            .pipe(map((res: any) => res));
    
    }


}

function RequestOptions(arg0: { headers: HttpHeaders; }) {
    throw new Error('Function not implemented.');
}
