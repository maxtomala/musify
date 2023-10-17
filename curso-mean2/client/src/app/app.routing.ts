import { ModuleWithProviders } from "@angular/core";
import { NgModule } from "@angular/core";

import{ Routes, RouterModule } from '@angular/router'
//user
import { HomeComponent } from './components/home.component';
import { UserEditComponent } from "./components/user-edit.component";
//artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
//album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

//song
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';


const appRoutes: Routes =[
    {path:'',component:HomeComponent},
    {path:'artistas/:page', component:ArtistListComponent},
    {path:'crear-artista', component:ArtistAddComponent},
    {path:'editar-artista/:id', component:ArtistEditComponent},
    {path:'artista/:id', component: ArtistDetailComponent},
    {path:'crear-album/:artist', component: AlbumAddComponent},
    {path:'album-detail/:id', component: AlbumDetailComponent},
    {path:'editar-album/:id', component: AlbumEditComponent},
    {path:'album/:id', component: AlbumDetailComponent},
    {path:'crear-tema/:album', component: SongAddComponent,},
    {path:'editar-tema/:id', component: SongEditComponent},

    {path:'mis-datos', component:UserEditComponent},
    {path: '**', component: HomeComponent},

];


export const appRoutingProviders: any[]= [];
//export const rouiting: ModuleWithProviders=RouterModule.forRoot(appRoutes);


@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
  
  // Exporta el módulo AppRoutingModule con los proveedores de enrutamiento
  export const routing = RouterModule.forRoot(appRoutes);