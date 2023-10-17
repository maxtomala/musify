import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { UploadService } from "../services/upload.services";
import { ArtistService } from "../services/artist.services";
import { Artist } from "../models/artist";

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService ]
})
export class ArtistEditComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage: any;
    public is_edit: any;
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _Router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _artistService: ArtistService,
       
    ) {
        this.titulo = 'Editar artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist= new Artist('','','', '');
        this.alertMessage =null;
        this.is_edit=true;
      
    }

    ngOnInit() {
        //llamar al metodo del api para sacar un artista en base a su id getArtist
        this.getArtist();
    }
    getArtist(){
        this._route.params.forEach((params:Params) => {
            let id=params['id'];
            this._artistService.getArtist(this.token,id).subscribe(
                (                response: { artist: Artist; }) =>{
                        if(!response.artist){
                            this._Router.navigate(['/'])
                        }else{
                            this.alertMessage= ('¡El Artista se ha creado correctamente!');

                             this.artist=response.artist;
                        }
                },
                (                error: { error: any; }) => {
                    if (error.error) {
                      this.alertMessage = JSON.stringify(error.error);
                      console.error(error.error);
                    }
                  }
            );

        });
    }

    onSubmit() {
        // Aquí deberías implementar la lógica para enviar los datos del formulario.
        // Puedes acceder a los valores del artista a través de this.artist.
        this._route.params.forEach((params:Params) => {
            let id=params['id'];
        
            this._artistService.editArtist(this.token,id,this.artist).subscribe(
                response=> { 
                    if(!response.artist){  
                        this.alertMessage= ('error en el servidor');
                    }else {
                        this.alertMessage= ('¡El artista se ha Actualizado correctamente!');

                       if(!this.filesToUpload) {
                            this._Router.navigate(['/artista/', response.artist._id]) ;
                       }else{
                        //subir la imagen de artista
                        this._uploadService.makeFileRequest(this.url + '/upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
                            .then(
                            (result: any) => {
                                this._Router.navigate(['/artistas/',  response.artist._id]);
                            }
                            )
                            .catch(
                            (error: any) => {
                                console.log(error);
                            }
                            );
                        }
                    }
                },

                error => {
                    if (error.error) {
                    this.alertMessage = JSON.stringify(error.error);
                    console.error(error.error);
                    }
                }
            );
        });

      }
     

    fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
}


}

function makeFileRequest(arg0: string, arg1: never[], filesToUpload: File[] | undefined, token: any, arg4: string) {
    throw new Error("Function not implemented.");
}

