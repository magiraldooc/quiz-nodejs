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
  console.log('1. ' + busqueda);
  busqueda = '%' + busqueda.toLowerCase().trim().replace(' ', '%') + '%';
  console.log('2. ' + busqueda);
  models.Quiz.findAll({where: ["LOWER(pregunta) like ?", busqueda]}).then(function(quizes){
    console.log('3. ' + quizes);
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
