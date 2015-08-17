var models = require('../models/models.js');

//GET /login
exports.new = function(req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

//POST /login
exports.create = function(req, res){
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.authenticate(login, password, function(error, user){
    //Si hay un error retornamos mensajes de error de sesión
    if(error){
      req.session.errors = [{'message': 'Se ha producido un error: ' + error}];
      res.redirect('/login');
      return;
    }

    //Crea req.session.user y guarda los campos id y username
    //La sesión se define por la existencia de req.session.user
    req.session.user = {id: user.id, username: user.username};

    //Redirección al path anterior a login
    res.redirect(req.session.redir.toString());
  });
};

//DELETE /logout
exports.destroy = function(req, res){
  delete req.session.user;
  //Redirección al path anterior a login
  res.redirect(req.session.redir.toString());
};
