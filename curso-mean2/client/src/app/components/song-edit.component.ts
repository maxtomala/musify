import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';


import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { UploadService } from "../services/upload.services";

import { SongService } from "../services/song.service";


import { Song } from "../models/song";
import { Artist } from "../models/artist";
import { Album } from "../models/album";

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})
export class SongEditComponent implements OnInit {
    public titulo: string;
    public song: Song
    // public name:any

    public identity;
    public token;
    public url: string;
    public alertMessage: any;
    public is_edit: any;
    album: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _songService: SongService

    ) {
        this.titulo = 'Editar canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

        this.song = new Song('',1, '', '', '', null);
        this.alertMessage = this.alertMessage;
        this.is_edit = true;
    }

    ngOnInit() {
        //sacar la cancion  editar
        this.getSong();

    }
    getSong(){
        this._route.params.forEach((params:Params)=>{
            let id=params['id']

            this._songService.getSong(this.token,id).subscribe(
                response =>{
                    // console.log(response.status)
                    if(!response.song){
                        this._router.navigate(['/'])
                    }else{
                        this.song = response.song;
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if( errorMessage != null){
                        var body =JSON.parse(error._body);
                        console.error(error.error);
                    }
                    // if (error.error) {
                    //     // this.alertMessage = JSON.stringify(error.error);
                    //     console.error(error.error);
                    // }
                }

            );
        } );
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._songService.editSong(this.token, id, this.song).subscribe(    // peticion del servicio a apique le pasa al token,y el album q quieres guardar
                response => {

                    if (!response.song) {
                        this.alertMessage = ('error en el servidor2 ui');
                    } else {
                        this.alertMessage = ('¡La canción se ha actualizado correctamente!');

                        if(!this.filesToUpload){
                            this._router.navigate(['/album/', response.song.album]);

                        }else{
                        //subir el fichero de audio
                        this._uploadService.makeFileRequest(this.url + '/upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
                            .then(
                                (result: any) => {
                                    this._router.navigate(['/album/', response.song.album]);
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
    public filesToUpload:Array<File> | any;
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;



}

}
