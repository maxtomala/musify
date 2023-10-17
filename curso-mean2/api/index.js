// const expressApp = require('./app');
// const dbConnect = require('./dbConnect');

// const port = process.env.PORT || 3977;

// async function startServer() {
//   const db = await dbConnect.connectToDB();

//   // Realiza operaciones en la base de datos utilizando "db" aquí

//   expressApp.listen(port, function() {
//     console.log(`API escuchando en http://localhost:${port}`);
//   });

// }



// startServer();



var mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/curso_mean2';
// const dbName = 'curso_mean2';
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
  mongoose.connect(url,{ useMongoClient: true },(err,res)=>{
    if(err){
      throw err;
    }else{
      console.log("la conexion con la base de datos funciona correctametne");
      app.listen(port,function(){
        console.log("servdiro http://localhost:"+port);
      });
    }
  });

