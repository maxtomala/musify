import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { SongService } from "../services/song.service";


import { Song } from "../models/song";
import { Album } from "../models/album";
import { Artist } from "../models/artist";

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService,SongService,]
})
export class SongAddComponent implements OnInit {
    public titulo: string;
   
    public song: Song 
    // public name:any
    public fileChangeEvent: any;
    public identity;
    public token;
    public url: string;
    public alertMessage: any;
    public is_edit:any;
    album: any;
    

   // public alertMessage: any;

    constructor(
        private _route: ActivatedRoute,
        private _Router: Router,
        private _userService: UserService,
        private _songService:SongService
       
    ) {
        this.titulo = 'Crear un nueva canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        let albumAux = new Album('','','',0,'',new Artist('','','',''));
        this.song= new Song('',1,'','','',albumAux);
        // this.alertMessage = this.alertMessage; 
    }

    ngOnInit() {
        //llamar al metodo del api para sacar un artista en base a su id get Artist
      
    }

    onSubmit() {
        this._route.params.forEach((params:Params) => {
            let album_id=params ['album'];
            this.song.album= album_id;
         

            this._songService.addSong(this.token, this.song).subscribe(    // peticion del servicio a apique le pasa al token,y el album q quieres guardar
                response=> { 
                  
                    if(!response.song){  
                        this.alertMessage= ('error en el servidor');
                    }else {
                        this.alertMessage= ('¡La canción se ha creado correctamente!');
                        this.song= response.song;

                        this._Router.navigate(['/editar-tema',response.song._id]);
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
 
}