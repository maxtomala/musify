'use strict'

var express =require('express')
var AlbumController = require ('../2-controller/album');
var api = express.Router(); //hace funciones get,post,put etc
var md_auth= require('../middlewwares/authenticated')

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/albums'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum)// crea ruta,metodo,cargar el metodo del controlador
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum)//añadir
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums)// crea ruta,metodo,cargar el metodo del controlador
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum)
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum)
api.post('/upload-image-album/:id',[md_auth.ensureAuth, md_upload],AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);


//exportar el metodo del api
module.exports = api;