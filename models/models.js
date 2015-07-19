var path = require('path');

//Carga modelo ORM
var sequelize = require('sequelize');

//Usa BD SQLite
var seq = new sequelize(
  null,
  null,
  null,
  {dialect: 'sqlite', storage: 'quiz.sqlite'}
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
      }).then(function(){
        console.log('Base de datos inicializada');
      });
    };
  });
});
