'use strict'
//para poder trbj con lso temas del fichero, enviar y devolver en la api rest
var path =   require ('path');
var fs =     require ('fs');
var mongoosePaginate =require ('mongoose-pagination');

var Artist = require ('../3-models/artist');
var Album =  require ('../3-models/album');
var Song =   require ('../3-models/song');
const artist = require('../3-models/artist');
const album = require('../3-models/album');

function getArtist(req,res){
    var artistId =req.params.id;
    console.log(artistId)
     
    Artist.findById(artistId,(err,artist) =>{
        if(err){
            res.status(500).send({message:'error en la petición'});
        }else{
            if(!artist){
                res.status(404).send({message:'El artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
    
    // res.status(200).send({message: 'método getArtist del controlador Artist.js'})
}
 function getArtists (req,res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage =4;
   
    Artist.find().sort('name').paginate(page,itemsPerPage,function(err,artists,total){
        if (err){
            res.status(500).send({message:'error en la petición'});
        }else{
            if(!artists){
                res.status(404).send({message:'no hay artista!!'});
            }else{
                return res.status(200).send({
                    pages:total,
                    artists:artists
                })
            }

        }
    })
 }


function saveArtist(req,res){
    var artist = new Artist();
    var params=req.body;
        artist.name =params.name;
     
        artist.description =params.description;
        artist.image='null';
     

        artist.save((err,artistStored) => {
            if(err){
                res.status(500).send({message:'error al guardar el artista'});
            }else{
                if(!artistStored){
                    res.status(404).send({message:'el artista no ha sido guardado'});
                }else{
                    console.log("artist");

                    res.status(200).send({artist:artistStored});

                }
            }
        });

}

function updateArtist(req,res){
 var artistId = req.params.id;
 var update   = req.body;

 Artist.findByIdAndUpdate (artistId,update,(err, artistUpdate) =>{
    if (err){
        res.status(500).send ({message:'error al guardar el artista'})
    }else{
        if (!artistUpdate){
            res.status(404).send({ message: 'El artista no ha sido actualizado'})
        }else{
            res.status(200).send({ artist: artistUpdate})

        }
    }
 })
 }

 function deleteArtist (req,res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId,(err,artistRemoved) => {
        if (err){
            res.status(500).send ({message:'error al eliminar el artista'})
        }else{
            if(!artistRemoved){
                res.status(404).send({message:'El artista no ha sido eliminado'})

            }else{
                
                Album.find({artist: artistRemoved._id}).remove((err,albumRemoved) =>{
                    if (err){
                        res.status(500).send({message:'error al eliminar el album'})
                    }else{
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
                                            res.status(200).send({artist:artistRemoved})
                                        }
                
                                    }
                                
                            });
                        }
                    }
                });
            }
        }
     })
}

function uploadImage(req,res){
    var artistId= req.params.id;
    var file_name ='no subido...';
 

    if( req.files){
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            if(file_ext =='png'|| file_ext == 'jpg'|| file_ext == 'gif'){
                    console.log('identificativooo')
                    Artist.findByIdAndUpdate(artistId,{image: file_name},(err,artistUpdate) =>{
                            if(!artistId){
                                    console.log('error')
                                    res.status(404).send({message:'Nose ha podido actualizar el usuario'});
                            }else{
                                    console.log('ok')
                                    res.status(200).send({artist:artistUpdate});
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
    var path_file ='./uploads/artists/'+getImageFile;
    console.log(path_file);
    fs.exists(path_file,function(exists){
            if(exists){
                    res.sendFile(path.resolve(path_file));
            }else{
                    res.status(200).send({message:'no existe la imagen...'})
            }
    });
}



//  te haces un objeto con todos los metodos que hay.
module.exports ={
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}