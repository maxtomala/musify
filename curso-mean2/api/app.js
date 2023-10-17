'use strict'

// expressConfig.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//cargar rutas
var user_routes   = require('./1-routes/user');
var artist_routes = require('./1-routes/artist');
var album_routes  = require('./1-routes/album');
var song_routes   = require('./1-routes/song');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar cabeceras http
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Resquested-with,Content-Type,Accept,Acces-Control-Allow-Resquest-Method');
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');

    next();
})

// // Rutas base
app.use('/api',user_routes);
app.use('/api',artist_routes);
app.use('/api',album_routes);
app.use('/api',song_routes);


module.exports = app;