import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService {
    public identity: any;
    url: string;
    token: any;
    id: any;
  
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }
  
    getArtists(token: any, page: any): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
            // puede que me falte aun codigo como la variable: let options=new RequesOptions({ headers: headers });
            //  return this._http.get(this.url + '/artists/' + page,options).map=>res.json());
        return this._http.get(this.url + '/artists/' + page, { headers: headers })
            .pipe(map((res: any) => res));
    }

    getArtist(token: any, id: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.get<any>(`${this.url}/artist/${id}`, { headers: headers });

        // return this._http.get(this.url + '/artist/' + id, { headers: headers })
        //    .pipe(map((res: any) => res));
    }

    addArtist(token: any, artist: Artist): Observable<any> {
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + '/artist/', params, { headers: headers })
            .pipe(map((res: any) => res));
    }

    editArtist(token: any, id: string, artist: Artist): Observable<any> {
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + '/artist/' +id, params, { headers: headers })
            .pipe(map((res: any) => res));
    }

    deleteArtist(token: any, id: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url + '/artist/' + id, { headers: headers })
            .pipe(map((res: any) => res));
    }
}
