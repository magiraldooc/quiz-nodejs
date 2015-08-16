var models = require('../models/models.js');

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
