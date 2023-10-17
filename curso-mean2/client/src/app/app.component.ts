import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService],
})

export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity: any;
  public token: any;
  public errorMessage: any;
  public alertRegister: any;
  public url: string;

  constructor(private _userService: UserService,
    private _route: ActivatedRoute,
    private _Router: Router,
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url + '/get-image-user/' + this.user.image;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.url = GLOBAL.url + '/get-image-user/' + this.identity.image;

    this.token = this._userService.getToken();


  }

  public onSubmit() {



    // Obtener datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      (response) => {

        let identity = response.user;

        this.identity = identity;



        if (!this.identity._id) {
          // alert("el usuario no está correctamente identificado");
        } else {
          // Crear elemento en el local storage para tener al usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));
          // CONSEGUIR EL TOKEN Y ENVIARLO EN CADA PETICIÓN HTTP
          this._userService.signup(this.user, true).subscribe(
            (response) => {
              let token = response.token;
              this.token = token;


              if (this.token?.length <= 0) {
                alert("el token no se ha generado correctamente");
              } else {
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', 'ROLE_USER', '', '');
                //colocar el direccionamiento a la nueva spa
              }
            },
            (error) => { // Agrega el manejo de errores aquí
              if (error.error) {

                this.errorMessage = JSON.stringify(error.error); // Convierte el error a formato JSON
                console.log(error.error); // Imprime el error en formato JSON
              }
            }
          );
        }
      }
    );
  }

  public logout() {
    localStorage.removeItem("identity");
    localStorage.removeItem("token");
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._Router.navigate(['/']);
  }

  onSubmitRegister() {


    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = 'error al registrarse';
        } else {
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.user_register.email;
          this.user_register = new User('', '', '', '', 'ROLE_USER', '', '');
        }
      },

      (error) => { // Agrega el manejo de errores aquí
        if (error.error) {

          this.alertRegister = JSON.stringify(error.error); // Convierte el error a formato JSON
          console.log(error.error); // Imprime el error en formato JSON
        }
      });


  }


}
