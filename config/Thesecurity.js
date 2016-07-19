/*
 * This module is a set of interesting security modules that i have seen that they are compulsory
 * to avoid some known attacks.
*/


var filter = require('content-filter'), // anti NO-SQL injection
    csrf = require('csurf'),            // helps  avoid CSRF in pages
    helmet = require('helmet'),         //useful security-headers
    config = require('./config')

module.exports = function(app){
  //Avoid NO-SQL injection  in the urls and forms
  app.use(filter({
    urlMessage: 'Un caractere interdit a été trouvé dans le lien' ,
    bodyMessage: 'Un caractere interdit a été trouvé dans les données de formulaire',
  }))

  app.use(helmet()); 
  app.use(helmet.noSniff()) 
  app.use(helmet.frameguard({ action: 'deny' }))// Don't allow my app to be in ANY frames:
  app.use(helmet.xssFilter())     //X-XSS-Protection HTTP header 
  app.use(helmet.hidePoweredBy({ setTo: 'Erlang' })) // Spoof server Name  to Erlang. LOL

  //ces 2 fxions ki suivent c est pour eviter un attaque de csrf lors d'un post
  /*
   * These two functions are used to avoid csrf attack during a HTTP POST 
   * we simply add an other cookie name to be sure that the page the user has came from us.
   * this function only works in the case of a POST.
   * Though in this app i haven t used forms so i won't use it
  */
  app.use(csrf());
  app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    return next();
  });
   // Handle CSRF token error or attack....
  app.use(function(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN')  return next(err);
    // handle CSRF token errors here 
    next();
  })

}