'use strict'
//para poder trbj con lso temas del fichero, enviar y devolver en la api rest
var path =   require ('path');
var fs =     require ('fs');
var mongoosePaginate =require ('mongoose-pagination');

var Artist = require ('../3-models/artist');
var Album =  require ('../3-models/album');
var Song =   require ('../3-models/song');

function getSong(req, res ){
    var songId= req.params.id;

    Song.findById(songId).populate({path:'album'}).exec((err,song)=>{
if(err){
    res.status(500).send({message: 'Error en la peticion'});
}else{
    if(!song){
        res.status(404).send({message: 'la cancion no existe!!'});
    }else{
        res.status(200).send({song})
    }
}
    });
  
}

function getSongs (req,res){
    var albumId = req.params.album;
    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album:albumId}).sort('number');
    }
    find.populate({
        path:'album',
        populate:{
            path: 'artist',
            model:'Artist'
        }
    }).exec(function(err,songs){
        if (err){
        res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!songs){
                res.status(404).send({message: 'no hay canciones'});
            }else{
                res.status(200).send({songs})
            }
        }
    });
}


function saveSong(req,res){
    var song= new Song();

    var params=req.body;
    song.number=params.number;
    song.name =params.name;
    song.duration =params.duration
    song.file =null;
    song.album =params.album;
    
    song.save((err,songStored)=>{
        if(err){
            res.status(500).send({message:'error en el servidor'})
        }else{
            if(!songStored){
                res.status(404).send({message:'no se ha guardo la cancion'})
            }else{
                res.status(200).send({song: songStored});
            }
            
        }
    });

}
 function updateSong(req,res){
    var songId =req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update,(err,songUpdated)=>{
        if(err){
            res.status(500).send({message:'error en el servidor'})
        }else{
            if(!songUpdated){
                res.status(404).send({message:'no se ha actualizado la cancion'})
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    })
 }

  function deleteSong(req,res){
    var songId =req.params.id;
    Song.findByIdAndRemove(songId,(err,songRemoved)=>{
        if(err){
            res.status(500).send({message:'error en el servidor'})
        }else{
            if(!songRemoved){
                res.status(404).send({message:'no se ha borrado la cancion'})
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    })
  }
  function uploadFile(req,res){
    var songId= req.params.id;
    var file_name ='no subido...';
 

    if( req.files){
            var file_path = req.files.file.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            if(file_ext == 'mp3' || file_ext == 'ogg'){
                    console.log('identificativooo')
                    Song.findByIdAndUpdate(songId,{file: file_name},(err,songUpdated) =>{
                            if(!songUpdated){
                                    res.status(404).send({message:'No se ha podido actualizar la cancion'});
                            }else{
                                    res.status(200).send({song:songUpdated});
                            }
                    
                    });
                    
            }else{ 
                    res.status(200).send({message:'Extensión del archivo no valida'});
            }
    
    }else{
            res.status(200).send({message: 'no se has subido el fichero de audio...'});

    }

}

function getSongFile(req, res){
    var imageFile =req.params.songFile;
    var path_file ='./uploads/song/'+imageFile;
    console.log(path_file);
    fs.exists(path_file,function(exists){
            if(exists){
                    res.sendFile(path.resolve(path_file));
            }else{
                    res.status(200).send({message:'no existe el fichero de audio...'})
            }
    });
}

module.exports={
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};
