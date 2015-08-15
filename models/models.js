var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var bd_name = (url[6] || null);
var user = (url[2] || null);
var pdw = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;
console.log(url);
//Carga modelo ORM
var sequelize = require('sequelize');

//Usa BD SQLite
var seq = new sequelize(
  bd_name,
  user,
  pdw,
  { dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, //Solo en SQLite (.env)
    omitNull: true //Solo en Postges (heroku)
  }
);

//Importa la definición de la tabla Quiz en quiz.js
var Quiz = seq.import(path.join(__dirname, 'quiz'));

//Exporta la definición de la tabla Quiz
exports.Quiz = Quiz;

//seq.sync() crea e inicializa la tabla de preguntas en la BD
//Ya no se usa el metodo success, debe usarse then
seq.sync().then(function(){
  //then(...) ejecuta el manejador una vez se crea la tabla
  Quiz.count().then(function(count){
    //Se inicializa si la tabla está vacía
    if(count === 0){
      Quiz.create({
        pregunta: '¿Cuál es la capital de Italia?',
        respuesta: 'Roma'
      });
      Quiz.create({
        pregunta: '¿Cuál es la capital de Portugal?',
        respuesta: 'Lisboa'
      }).then(function(){
        console.log('Base de datos inicializada');
      });
    }
    if(count == 2){
      Quiz.create({
        pregunta: '¿What is the capital of United Kindom?',
        respuesta: 'London'
      }).then(function(){
        console.log('Base de datos inicializada');
      });
    }
  });
});
