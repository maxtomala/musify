import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.services";

import { Artist } from "../models/artist";


@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService,ArtistService]  
})

export class ArtistListComponent implements OnInit {
    public titulo: string;
    public artists: Array<Artist> = [];
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public alertMessage: any;

    constructor(
        private _route: ActivatedRoute,
        private _Router: Router,
        public _artistService: ArtistService,
        private _userService: UserService
    ) {
        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page=1;
        this.prev_page=1;    
      }

    ngOnInit() {
        //conseguir el listado de artistas
        this.getArtists();
        // this.onDeleteArtist();
    }

    getArtists(){
        this._route.params.forEach((params:Params)=>{
            let page =+params['page'];
            if(!page){
                page=1;
            }else{
                this.next_page=page+1;
                this.prev_page=page-1;

                if(this.prev_page==0){
                    this.prev_page=1;
                }
            }
            this._artistService.getArtists(this.token,page,).subscribe(
                    response=>{
                    if(!response.artists){
                        this._Router.navigate(['/'])
                    }else{
                       this.artists=response.artists;
  
                    }
            },
            (                error: { error: any; }) => {
                if (error.error) {
                  this.alertMessage = JSON.stringify(error.error);
                  console.error(error.error);
                }
              });
        });
    }
    public confirmado: any;
    onDeleteConfirm(id: any){
        this.confirmado=id;
    }
    onCancelArtist(){
        this.confirmado= null;
    }
    onDeleteArtist(artist: Artist) {

        this._artistService.deleteArtist(this.token, artist._id).subscribe(
          (response) => {
            if (!response.artist) {
              alert('Error en el servidor');
            }
            this.getArtists();
          },
          (error: { error: any }) => {
            if (error.error) {
              this.alertMessage = JSON.stringify(error.error);
              console.error(error.error);
            }
          }
        );
      }


}

