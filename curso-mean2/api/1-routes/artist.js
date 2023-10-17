'use strict'

var express =require('express')
var ArtistController = require ('../2-controller/artist');
var api = express.Router(); //hace funciones get,post,put etc
var md_auth= require('../middlewwares/authenticated')

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/artists'});

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist)// crea ruta,metodo,cargar el metodo del controlador
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist)
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists)
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist)
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist)
api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload],ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

    
//exportar el metodo del api
module.exports = api;
