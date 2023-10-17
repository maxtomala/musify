import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.services";
import { Artist } from "../models/artist";
@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})
export class ArtistAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage: any;
    public is_edit: boolean = true;

    // public alertMessage: any;

    constructor(
        private _route: ActivatedRoute,
        private _Router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,

    ) {
        this.titulo = 'Crear nuevo artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '');
        this.alertMessage = this.alertMessage;
    }

    ngOnInit() {
        //conseguir el listado de artistas
    }

    onSubmit() {
        // Aquí deberías implementar la lógica para enviar los datos del formulario.
        // Puedes acceder a los valores del artista a través de this.artist.

        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => { // eeeeeeeeeeeeeeeeeeeeiiiii
                if (!response.artist) {
                    this.alertMessage = ('error en el servidor');
                } else {
                    //localStorage["saveArtist"]('identity', JSON.stringify(this.artist));
                    this.alertMessage = 'el artista se ha creado correctamente';
                    this.artist = response.artist;
                    this._Router.navigate(['/editar-artista', response.artist._id]);
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

    fileChangeEvent(event: any) {
        const selectedFile = event.target.files[0];
    }
}

