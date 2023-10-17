import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {
    public identity: any;
    url: string;
    token: any;
    id: any;
  
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }
    getAlbums(token: any, artistId: string | null = null): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = { headers: headers };

        if (artistId === null) {
            return this._http.get<any>(`${this.url}/albums/`, options)
              
        } else {
            return this._http.get<any>(`${this.url}/albums/${artistId}`, options)
               
        }
    }


    getAlbum(token: any, id: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get<any>(`${this.url}/album/${id}`, { headers: headers });
            // .pipe(
            //     map(response => response.json())
            // );
    }

    addAlbum(token: any, album: Album): Observable<any> { //va a recibir un token y objeto album: y es el que guarda en bd
        
        let idAlbum =album._id
        let params = JSON.stringify(album);             //convierte album a string json
        let headers = new HttpHeaders({                 //controla si cuando envias el token es correcta al idenficacion y permite acceder o no
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + '/album/', params, { headers: headers }) // enviar una peticion por post+ruta album parametro : las cosas q tiene q guardar(e nuevo bjeto o inf a guardar)
            .pipe(map((res: any) => res));
    }

    editAlbum(token: any, id:string, album: Album): Observable<any> { //va a recibir un token y objeto album: y es el que guarda en bd
        let params = JSON.stringify(album);             //convierte album a string json
        let headers = new HttpHeaders({                 //controla si cuando envias el token es correcta al idenficacion y permite acceder o no
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + '/album/'+id, params, { headers: headers }) // enviar una peticion por post+ruta album parametro : las cosas q tiene q guardar(e nuevo bjeto o inf a guardar)
            .pipe(map((res: any) => res));
    }

    deleteAlbum(token: any, id: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete<any>(`${this.url}/album/${id}`, { headers: headers });
            // .pipe(
            //     map(response => response.json())
            // );
    }
}