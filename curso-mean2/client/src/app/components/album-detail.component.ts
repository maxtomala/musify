import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { AlbumService } from "../services/album.service";
import { Album } from "../models/album";
import { Artist } from "../models/artist";
import { SongService } from "../services/song.service";
import { Song } from "../models/song";

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService,SongService]
})
export class AlbumDetailComponent implements OnInit {
    public identity;
    public songs: Array<Song> = [];
    public token;
    public url: string;
    public alertMessage: any;
    public confirmado: any;
    public album: any;
  
  
    constructor(
        private _route: ActivatedRoute,
        private _Router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService

    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.alertMessage = this.alertMessage;
        // this.album = new Album('','','',2016,'',);
        // this.song= new Song('',1,'','','', '');

    } 

    ngOnInit() {
        // sacar un Album de la bd 
        this.getAlbum();
       
    }
    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._Router.navigate(['/'])
                    } else {
                        this.album = response.album;
                        //sacar las canciones



                        this._songService.getSongs(this.token, response.album._id).subscribe(    // peticion del servicio a apique le pasa al token,y el album q quieres guardar
                        response=> { 
                            if(!response.songs){  
                                this.alertMessage= ('Este album no tiene canciones');
                            
                            }else {
                                this.songs= response.songs;                                
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
  
    onDeleteConfirm(id: string){
        this.confirmado=id;
    }
    onCancelSong(){
        this.confirmado =null;
    }
    onDeleteSong(id: string){
        this._songService.deleteSong(this.token,id).subscribe(
            response => {
                if (!response.song) {
                    alert('error en el servidor');   
                }
                this.getAlbum();
            },
            error => {
                if (error.error) {
                    this.alertMessage = JSON.stringify(error.error);
                    console.error(error.error);
                }
            }

        );
    }

    startPlayer(song:any){
        let song_player = JSON.stringify(song);
        let file_path = this.url+'/get-song-file/'+song.file;
        let image_path = this.url +'/get-image-album/'+song.album.image;
        

        localStorage.setItem('sound_song', song_player);
        document.getElementById("mp3-source")?.setAttribute("src",file_path);
        (document.getElementById("player")as any).load();
        (document.getElementById("player")as any).play();

        document.getElementById('play-song-title')!.innerHTML=song.name;
        document.getElementById('play-song-artist')!.innerHTML=song.album.artist.name;
        document.getElementById('play-song-album')?.setAttribute('src',image_path);
    }


}
