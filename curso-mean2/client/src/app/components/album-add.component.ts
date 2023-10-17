import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.services";
import { AlbumService } from "../services/album.service";
import { Artist } from "../models/artist";
import { Album } from "../models/album";

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService ]
})
export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public fileChangeEvent: any;
    public artist: Artist | undefined;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage: any;
    public is_edit:any;
    
   // public alertMessage: any;

    constructor(
        private _route: ActivatedRoute,
        private _Router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _artistService: ArtistService,
       
    ) {
        this.titulo = 'Crear un nuevo album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        let artist= new Artist("","", "", "");
        this.album= new Album('','','',2017,'',artist,);
        this.alertMessage = this.alertMessage; 
    }

    ngOnInit() {
        //llamar al metodo del api para sacar un artista en base a su id get Artist
    }

    onSubmit() {
        this._route.params.forEach((params:Params) => {
            let artist_id=params ['artist'];
            this.album.artist= artist_id;

            this._albumService.addAlbum(this.token, this.album).subscribe(    // peticion del servicio a apique le pasa al token,y el album q quieres guardar
                response=> { 
                    if(!response.album){  
                        this.alertMessage= ('error en el servidor');
                    }else {
                        this.alertMessage= ('¡El album se ha creado correctamente!');
                        this.album= response.album;
                        this._Router.navigate(['/editar-album',response.album._id]);
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