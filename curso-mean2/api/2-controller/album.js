'use strict'
//para poder trbj con lso temas del fichero, enviar y devolver en la api rest
var path =   require ('path');
var fs =     require ('fs');
var mongoosePaginate =require ('mongoose-pagination');

var Artist = require ('../3-models/artist');
var Album =  require ('../3-models/album');
var Song =   require ('../3-models/song');
const album = require('../3-models/album');
//const artist = require('../3-models/artist');
//const album = require('../3-models/album');

function getAlbum(req,res){
    var albumId= req.params.id;
    Album.findById(albumId).populate({path:'artist'}).exec((err,album)=>{
    if(err){
        res.status(500).send({message:'error en la peticion'});
    }else{
        if(!album){
            res.status(404).send({message:'el album no existe'});
        }else{
            res.status(200).send({album});
        }
    }

    })

}
 function getAlbums(req,res){
    var artistId= req.params.artist;
    if(!artistId){
        //sacar todos los albums de la bbd
        var find= Album.find({}).sort('title');
    }else{
        //sacar los albums de un artista concreto bd
        var fin =Album.find({artist: artistId}).sort('year');
    }
    find.populate({path:'artist'}).exex((err,albums)=>{
        if(err){
        res.status(500).send({message:'error en la peticion'});
        }else{
            if(!albums){
                res.status(404).send({message:'no hay albums'});
            }else{
                res.status(200).send({albums})
            }
        }

    });
 }

function saveAlbum(req,res){
    var album =new Album();

    var params =req.body;
    album.title=params.title;
    album.description=params.description;
    album.year=params.year;
    album.image='null';
    album.artist=params.artist;

        album.save((err,albumStored)=>{
            if(err){
                res.status(500).send({message:'Error en el servidor'})
            }else{
                if(!albumStored){
                    res.status(400).send({message:'no se ha guardado el album'});
                }else{
                    res.status(200).send({album:albumStored});

                }
                
            }

        });
}

function getAlbums (req,res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage =3;
   
    Album.find().sort('name').paginate(page,itemsPerPage,function(err,album,total){
        if (err){
            res.status(500).send({message:'error en la petición'});
        }else{
            if(!album){
                res.status(404).send({message:'no hay artista!!'});
            }else{
                return res.status(200).send({
                    pages:total,
                    album:album
                })
            }

        }
    })
 }
 function updateAlbum(req,res){
    var albumId = req.params.id;
    var update  = req.body;
    console.log(update);
    console.log(albumId);

    Album.findByIdAndUpdate(albumId,update,(err,albumUpdated)   => {
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message:'no se ha actualidado el album'});
            }else{
                res.status(200).send({album:albumUpdated});

            }
        }

    });
 }
 function deleteAlbum(req,res){
    var albumId =req.params.id
    console.log("albumId")
    console.log(albumId)

    Album.findByIdAndRemove(albumId,(err,albumRemoved) =>{
        if (err){
            res.status(500).send({message:'error al eliminar el album'})
        }else{
            console.log(albumRemoved)

            if(!albumRemoved){
                res.status(404).send({message:'el album no ha sido eliminado'})
            }else{
                Song.find({album: albumRemoved._id}).remove((err,songRemoved) =>{
                        if (err){
                            res.status(500).send({message:'error al eliminar la canción'})
                        }else{
                            if(!songRemoved){
                                res.status(404).send({message:'la canción no ha sido eliminado'})
                            }else{
                                res.status(200).send({album:albumRemoved})
                            }
    
                        }
                    
                });
            }
        }
    })
 }
 function uploadImage(req,res){
    var albumId= req.params.id;
    var file_name ='no subido...';
 

    if( req.files){
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            if(file_ext =='png'|| file_ext == 'jpg'|| file_ext == 'gif'){
                    console.log('identificativooo')
                    Album.findByIdAndUpdate(albumId,{image: file_name},(err,albumUpdated) =>{
                            if(!albumUpdated){
                                    res.status(404).send({message:'Nose ha podido actualizar el usuario'});
                            }else{
                                    res.status(200).send({album:albumUpdated});
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
    var path_file ='./uploads/albums/'+getImageFile;
    console.log(path_file);
    fs.exists(path_file,function(exists){
            if(exists){
                    res.sendFile(path.resolve(path_file));
            }else{
                    res.status(200).send({message:'no existe la imagen...'})
            }
    });
}



module.exports ={
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}