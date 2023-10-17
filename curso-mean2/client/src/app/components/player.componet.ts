import { Component, OnInit}  from "@angular/core";
import { Song} from  '../models/song';
import { GLOBAL } from "../services/global";
import { Album } from "../models/album";
import { Artist } from "../models/artist";

@Component({
    selector:'player',
    template: `
    <div class="album-image">
    <span *ngIf="song.album">
        <img id="play-image-album" src="{{url + '/get-image-album/' + song.album.image}}" />
    </span>

    <span *ngIf="!song.album">
        <img id="play-image-abum" src="assets/images/default.jpg"/>
    </span>
    </div>

    <div class="audio-file">
        <p>Reproduciendo</p>
        <span id="play-song-title">
            {{song.name}}
        </span>
|
        <span id="play-song-artist">
            <span *ngIf="song?.album?.artist">
                {{song.album?.artist?.name}}
             </span>
        </span>
        <audio controls id="player">
            <source id="mp3-source" src="{{url+'/get-song-file/'+song.file}}" type="audio/mpeg">
            Tu navegador no es compatible con HTML5
        </audio>
    </div>
    `,
    

    providers: [],
})

export class PlayerComponent implements OnInit{
    public url: string;
    song: Song;


    constructor(){
        this.url = GLOBAL.url;
        let albumAux = new Album('','','',0,'',new Artist('','','',''));

        this.song = new Song( '',1,'','','',albumAux );
    }

    ngOnInit(){
        let aux= localStorage.getItem('sound_song');
        var song = JSON.parse(aux!);
        if(song){
            this.song =song;
        }else{
            this.song = new Song( '',1,'','','',null );
        }
    }

    
}