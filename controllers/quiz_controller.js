var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
  models.Quiz.findById(quizId).then(function(quiz){
    if(quiz){
      req.quiz = quiz;
      next();
    }else{
      next(new Error('No existe quizId= ' + quizId));
    }
  }).catch(function(error){
    next(error);
  });
};

//GET /quizes
exports.index = function(req, res){
  var busqueda = req.query.busqueda || '';
  busqueda = '%' + busqueda.toLowerCase().trim().replace(' ', '%') + '%';
  models.Quiz.findAll({where: ['LOWER(pregunta) like ?', busqueda]}).then(function(quizes){
    res.render('quizes/index', {quizes: quizes});
  }).catch(function(error){
    next(error);
  });
};

//GET /quizes/:id
exports.show = function(req, res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    res.render('quizes/show', {quiz: req.quiz});
  });
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    var resultado = 'Incorrecto';
    if(req.query.respuesta.toLowerCase().trim() === req.quiz.respuesta.toLowerCase().trim()){
      resultado = 'Correcto';
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
  });
};

//GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build({
    pregunta: 'Pregunta',
    respuesta: 'Respuesta'
  });
  res.render('quizes/new', {quiz: quiz});
};

//POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build(req.body.quiz);
  //Guarda en BD los campos pregunta y reespuesta
  quiz.save({
    fields: ['pregunta', 'respuesta']
  }).then(function(){
    res.redirect('/quizes');
  });
};
