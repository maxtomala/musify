import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.services";
import { Artist } from "../models/artist";
import { AlbumService } from "../services/album.service";
import { Album } from "../models/album";

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService,]
})
export class ArtistDetailComponent implements OnInit {
    public albums: Album[];
    public artist: Artist | undefined
    public identity;
    public token;
    public url: string;
    public alertMessage: any;
    public confirmado: any;

    constructor(
        private _route: ActivatedRoute,
        private _Router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,

    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.alertMessage = this.alertMessage;
        this.albums = [];



    }

    ngOnInit() {
        //llamar al metodo del api para sacar un artista en base a su id get Artist
        this.getArtist();
    }
    getArtist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist) {
                        this._Router.navigate(['/'])
                    } else {
                        this.artist = response.artist;
                        //sacar los albums del artista
                        this.getAlbumsServices(response);

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

    getAlbumsServices(response: any){

        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
            response => {

                if (!response.album) {
                    this.alertMessage = 'Este artista no tiene albums';
                } else {


                        this.albums = response.album;
                    
                }
            }
        );
    }

    onDeleteConfirm(id: string) {
        this.confirmado = id;
    }


    onCancelAlbum() {
        this.confirmado = null;
    }
    onDeleteAlbum(id: string) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {

                if (!response.album) {

                    alert('Error en el servidor');
                }else{

                    this._albumService.getAlbums(this.token, response.album._id).subscribe(
                        response => {
            
                            if (!response.album) {
                                this.alertMessage = 'Este artista no tiene albums';
                            } else {
            
            
                                    this.albums = response.album;
                                
                            }
                        }
                    );
                    
                }
            },

            error=> {
                if (error.error) {
                    this.alertMessage = JSON.stringify(error.error);
                    console.error(error.error);
                }
            }


        )
    }

}
