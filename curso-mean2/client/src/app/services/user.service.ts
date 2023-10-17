import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
//import 'rxjs/add/operator/map';
import { Observable, identity } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';

@Injectable()
export class UserService {
    public identity: any;
    public token: any;
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;

    }



    //gethash devuelve el tokenq hemos generado en el backen
    signup(user_to_login: any, gethash = false): Observable<any> {
        let json = JSON.stringify(
            {
                "email": user_to_login.email,
                "password": user_to_login.password,
                "gethash": gethash
            });
        let params = json;

        let headers = new HttpHeaders({ 'Content-type': 'application/json' });

        return this._http.post(this.url + '/login/', params, { headers: headers });
        // .pipe(
        //     map((res: any) => res.json())

        // );

    }
    register(user_to_register: any): Observable<any> {
        // guardar en una variable el objeto json, el objeto del usuario  registrar convertido en formato string
        let params = JSON.stringify(user_to_register);
        let headers = new HttpHeaders({ 'Content-type': 'application/json' });

        return this._http.post(this.url + '/register/', params, { headers: headers });
        // .pipe(
        //     map((res: any) => res.json())

        //  );
    }
    updateUser(user_to_update: any): Observable<any> {
        // guardar en una variable el objeto json, el objeto del usuario  registrar convertido en formato string
        let params = JSON.stringify(user_to_update);


        let headers = new HttpHeaders({
            'Content-type': 'application/json',
            'Authorization': this.getToken()
        });

        return this._http.put(this.url + '/update-user/' + user_to_update._id, params, { headers: headers });
        // .pipe(
        //     map((res: any) => res.json())

        //  );
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity')!);

        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    getToken() {
        let token = localStorage.getItem('token');
        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;

    }
}