
/*
 * We choose how we handle errors depending on the environment i.e PROD or DEV 
 * these variables should not be hard coded but should be loaded from the computer environment
 * for security reasons...
*/
var isProd =true; // PROD

 /**
  * Description
  * @method errorHandler
  * @param {} err
  * @param {} req
  * @param {} res
  * @param {} next
  * @return 
  */
 exports.errorHandler = function(err,req,res,next){
 	if(!isProd){
      	console.log(err);
      	return res.status(500).json(err)
      }
    else 
      return res.render('error_page',{message_erreur:"Veuillez nous excuser de ce petit probleme"})
      // return res.status(500).json('Veuillez nous excuser de ce petit probleme ...')
 }
 exports.isDev= !isProd;