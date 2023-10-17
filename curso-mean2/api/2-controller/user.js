'use strict'
var fs = require('fs');
var path = require ('path');
var bycrypt = require('bcrypt-nodejs');
var User = require('../3-models/user');
var jwt = require('../services/jwt');


function pruebas(req, res) {
        res.status(200).send({
                message: 'probando una accion del controlador de usuario del api rest con Node y Mongo'
        });
}

function saveUser(req, res) {
        var user = new User();
        var params = req.body;

        console.log(params);

        user.name = params.name;
        user.surname = params.surname;
        console.log(params.surname);
        console.log(user.surname);
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = 'null';

        if (params.password) {
                //encriptar y guardar datos

                bycrypt.hash(params.password, null, null, function (err, hash) {
                        user.password = hash;

                        if (user.name != null && user.surname != null && user.email != null) {
                                //guardar el usuario   

                                user.save((err, userStored) => {


                                        // console.log(userStored);
                                        if (err) {
                                                res.status(500).send({ message: 'error al guardar el usuario' });
                                        } else {

                                                if (!userStored) {
                                                        res.status(404).send({ message: 'no se ha registradoe el usuario' });
                                                } else {
                                                        res.status(200).send({ user: userStored });
                                                }
                                        }
                                });

                        } else {
                                res.status(200).send({ message: 'introducir todos los campos' })

                        }
                });
        } else {
                res.status(200).send({ message: 'introducir la contraseña' })
        }
}

//comprobar el eamil y contraseña existe en la bd y coincide
function loginUser(req, res) {
        var params = req.body;

        var email = params.email;
        var password = params.password;

        // var user = new User();
        User.findOne({ email: email.toLowerCase() }, (err, user) => {
                if (err) {
                        res.status(500).send({ message: 'error en la peticion' });
                } else {
                        if (!user) {
                                res.status(404).send({ message: 'el usuario no existe' });
                        } else {
                                //comprobar la contraseña
                                bycrypt.compare(password, user.password, function (err, check) {
                                        console.log(check)
                                        if (check) {
                                                //devolver los datos del usuario logueado
                                                if (params.gethash) {
                                                        //devolver un token de jwt
                                                        res.status(200).send(
                                                                {
                                                                token: jwt.createToken(user)
                                                        }
                                                        );
                                                } else {
                                                        res.status(200).send({ user })
                                                }
                                        } else {
                                                res.status(404).send({ message: 'el usuario no ha podido logearse' });
                                        }
                                });

                        }
                }

        });
        
}
 function updateUser(req,res){
        var userId= req.params.id;
        var update = req.body;

        if(userId !== req.user.sub){
         return res.status(500).send({message:'No tienes permiso para actualizar este usuario'});
        }

        User.findByIdAndUpdate(userId,update, (err,userUpdated) => {
                if (err){
                        res.status(500).send({message:'Error al actualizar usuario'});
                }else{
                        if(!userUpdated){
                                res.status(404).send({message:'No se ha podido actualizar el usuario'});
                        }else{
                                res.status(200).send({user:userUpdated});
                        }
                }
        });
 }

 function uploadImage(req,res){
        var userId= req.params.id;
        var file_name ='no subido...';
        


        if( req.files){
                var file_path = req.files.image.path;
                var file_split = file_path.split('\\');
                var file_name = file_split[2];

                var ext_split = file_name.split('\.');
                var file_ext = ext_split[1];

                if(file_ext =='png'|| file_ext == 'jpg'|| file_ext == 'gif'){
                        console.log('identificativooo')
                        console.log(userId);
                        console.log(file_name);
                        User.findByIdAndUpdate(userId,{image: file_name},(err,userUpdated) =>{
                                if(!userUpdated){
                                        console.log('error')
                                        res.status(404).send({message:'Nose ha podido actualizar el usuario'});
                                }else{
                                        console.log('ok')
                                        res.status(200).send({image: file_name, user:userUpdated});
                                }
                        
                        });
                        
                }else{ 
                        res.status(200).send({message:'Extensión del archivo no valida'});
                }
        
        }else{
                res.status(200).send({message: 'no se has subido ninguna imagen...'});

        }

 }

function getImageFile(req, res){
        var getImageFile =req.params.imageFile;
        var path_file ='./uploads/users/'+ getImageFile;
        console.log(path_file);
        fs.exists(path_file,function(exists){
                if(exists){
                        res.sendFile(path.resolve(path_file));
                }else{
                        res.status(200).send({message:'no existe la imagen...'})
                }
        });
}




module.exports = {
        pruebas,
        saveUser,
        loginUser,
        updateUser,
        uploadImage,
        getImageFile
};