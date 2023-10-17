import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from "../services/user.service";


@Component({
    selector: 'home',
    templateUrl:'../views/home.html',
    providers: [UserService],

})

export class HomeComponent implements OnInit{
    public titulo: string;
    

    constructor(
        private _route:ActivatedRoute,
        private _Router: Router,
       
    ){
        this.titulo= 'Artistas';
    }

    ngOnInit(){
      
     }
}
