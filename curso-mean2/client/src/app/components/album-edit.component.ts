import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.services";
import { AlbumService } from "../services/album.service";
import { UploadService } from "../services/upload.services";

import { Artist } from "../models/artist";
import { Album } from "../models/album";

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService, UploadService]
})
export class AlbumEditComponent implements OnInit {
    public titulo: string;

    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage: any;
    public is_edit: any;

    constructor(
        private _route: ActivatedRoute,
        private _Router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _artistService: ArtistService,
        private _uploadService: UploadService,

    ) {
        this.titulo = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist("", "", "", "");

        this.album = new Album('', '', '', 2017, '', this.artist,);
        this.alertMessage = this.alertMessage;
        this.is_edit = true;
    }

    ngOnInit() {
        //llamar al metodo del api para sacar un artista en base a su id get Artist
        //conseguir el album
        this.getAlbum();

    }
    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                (response: { album: Album; }) => {
                    if (!response.album) {
                        this.alertMessage = ('error en el servidor');
                    } else {

                        this.alertMessage = ('¡El album se ha creado correctamente!');
                        this.album = response.album;

                    }
                },

                (error: { error: any; }) => {
                    if (error.error) {
                        this.alertMessage = JSON.stringify(error.error);
                        console.error(error.error);
                    }
                }

            )


        });
    }


    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];


            // this._albumService.editAlbum(this.token,id,this.album,).subscribe(  
            this._albumService.editAlbum(this.token, id, this.album).subscribe(    // peticion del servicio a apique le pasa al token,y el album q quieres guardar
                response => {
                    if (!response.album) {
                        this.alertMessage = ('error en el servidor');
                    } else {
                        this.alertMessage = ('¡El album se ha creado correctamente!');
                        if (!this.filesToUpload) {
                            //redirigir
                            this._Router.navigate(['/artista/', response.album.artist]);
                        } else {
                            //subir la imagen de album
                            this._uploadService.makeFileRequest(this.url + '/upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (result: any) => {
                                        this._Router.navigate(['/artista/', response.album.artist]);
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

    public filesToUpload: Array<File> | any;
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;



    }
}