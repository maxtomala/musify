'use strict'
var express = require ('express');
var UserController =require('../2-controller/user');

var api =express.Router();
var md_auth = require('../middlewwares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'});


api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);//deberia??
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);//funciona
api.get('/get-image-user/:imageFile', UserController.getImageFile); //Funciona


module.exports=api; 