var models = require('../models/models.js');

//Autoload :id de quizes
exports.load = function(req, res, next, quizId){
  models.Quiz.find({
    where: {id: Number(quizId)},
    include: [{model: models.Comment}]
  }).then(function(quiz){
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
    res.render('quizes/index', {
      quizes: quizes,
      errors: []
    });
  }).catch(function(error){
    console.log(error.message);
    next(error);
  });
};

//GET /quizes/:id
exports.show = function(req, res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    res.render('quizes/show', {
      quiz: req.quiz,
      errors: []
    });
  });
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    var resultado = 'Incorrecto';
    if(req.query.respuesta.toLowerCase().trim() === req.quiz.respuesta.toLowerCase().trim()){
      resultado = 'Correcto';
    }
    res.render('quizes/answer', {
      quiz: req.quiz,
      respuesta: resultado,
      errors: []
    });
  });
};

//GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build({
    pregunta: 'Pregunta',
    respuesta: 'Respuesta'
  });
  res.render('quizes/new', {
    quiz: quiz,
    errors: []
  });
};

//POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then(function(err){
    if(err){
      res.render('quizes/new', {
        quiz: quiz,
        errors: err.errors
      });
    }else{
      //Guarda en BD los campos pregunta y reespuesta
      quiz.save({
        fields: ['pregunta', 'respuesta', 'tematica']
      }).then(function(){
        res.redirect('/quizes');
      });
    }
  });
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz;
  res.render('quizes/edit', {
    quiz: quiz,
    errors: []
  });
};

//PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tematica = req.body.quiz.tematica;
  console.log(req.body.quiz.tematica);
  req.quiz.validate().then(function(err){
    if(err){
      res.render('quizes/edit', {
        quiz: req.quiz,
        errors: err.errors
      });
    }else{
      //Guarda en BD los campos pregunta y reespuesta
      req.quiz.save({
        fields: ['pregunta', 'respuesta', 'tematica']
      }).then(function(){
        res.redirect('/quizes');
      });
    }
  });
};

//DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){
    next(error);
  });
};
