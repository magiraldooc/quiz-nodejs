var models = require('../models/models.js');

//Autoload :id de comments
exports.load = function(req, res, next, commentId){
  models.Comment.find({
    where: {id: Number(commentId)}
  }).then(function(comment){
    if(comment){
      req.comment = comment;
      next();
    }else{
      next(new Error('No existe commentId= ' + commentId));
    }
  }).catch(function(error){
    next(error);
  });
};

//GET /quizes/:id/comments/new
exports.new = function(req, res){
  res.render('comments/new', {
    quizId: req.params.quizId,
    errors: []
  });
};

//POST /quizes/:id/comments
exports.create = function(req, res){
  console.log(req.params.quizId);
  var comment = models.Comment.build({
    texto: req.body.comment.texto,
    QuizId: req.params.quizId
  });
  console.log(comment);
  comment.validate().then(function(err){
    if(err){
      res.render('comments/new', {
        quizId: req.params.quizId,
        comment: comment,
        errors: err.errors
      });
    }else{
      //Guarda en BD el campo texto
      comment.save().then(function(){
        res.redirect('/quizes/' + req.params.quizId);
      });
    }
  }).catch(function(error){
    next(error);
  });
};

//PUT /quizes/:quizId/comments/:commentId/publis
exports.publish = function(req, res){
  req.comment.publicado = true;

  req.comment.save({
    fields: ['publicado']
  }).then(function(){
    res.redirect('/quizes/' + req.params.quizId);
  }).catch(function(error){
    next(error);
  });
};
