import { Component, OnInit } from "@angular/core";
import { GLOBAL } from '../services/global';
import { UserService } from "../services/user.service";
import { User } from '../models/user';

@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService]
})

export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity: any;
  public token: any;
  public alertMessage: any;
  public url: string;
  public filesToUpload: Array<File> = [];

  constructor(private _userService: UserService) {
    this.titulo = 'Actualizar mis datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = new User('', '', '', '', '', '', ''); // Inicializa el objeto User
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.user = this.identity; // Asigna la identidad al usuario
    this.user = this.identity; // Asigna la identidad al usuario
  }

  onSubmit() {

      this._userService.updateUser(this.user).subscribe(
      response => {
          if (!response.user) {
          this.alertMessage = 'El usuario no se ha actualizado';
        } else{
             localStorage.setItem('identity', JSON.stringify(this.user));
             //document.getElementById("identity_name").innerHTML = this.user.name;

             if (!this.filesToUpload){
                //redirecion
             }else{
                 this.makeFileRequest(this.url + '/upload-image-user/' + this.user._id, [], this.filesToUpload).then(
                   (result: any) => {
                     this.user.image = result.image;
                     localStorage.setItem('identity', JSON.stringify(this.user));
                     
                     let image_path=this.url+'/get-image-user/'+this.user.image;
                     document.getElementById('image-logged')?.setAttribute('src',image_path)
                    } 
                    );
                }
                this.alertMessage = 'Datos actualizados correctamente';
        }
      },
    
      error => {
        if (error.error) {
          this.alertMessage = JSON.stringify(error.error);
          console.error(error.error);
        }
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    var token = this.token;
    return new Promise(function (resolve, reject) {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token); 
      xhr.send(formData);
    });
  }
}
