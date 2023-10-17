// dbConnect.js
// var mongoose = require('mongoose');
// // const { MongoClient } = require('mongodb');

// const url = 'mongodb://127.0.0.1:27017';
// const dbName = 'curso_mean2';

// async function connectToDB() {
  // const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  // try {
  //   await client.connect();
  //   console.log('Conexión exitosa a la base de datos');

  //   const db = client.db(dbName);

  //   return db; // Retornar la conexión a la base de datos

  // } catch (err) {
  //   console.error('Error al conectar a la base de datos:', err);
  //   throw err;
  // }
// Configurar el sistema de advertencias de Node.js

// mongoose.Promise = global.Promise;
//   mongoose.connect(url,(err,res)=>{
//     if(err){
//       throw err;
//     }else{
//       console.log("la conexion con la base de datos funciona correctametne");
//     }
//   });

// }






// module.exports = { connectToDB };

