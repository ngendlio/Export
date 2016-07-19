

/*
 * We choose how we handle errors depending on the environment i.e PROD or DEV 
 * these variables should not be hard coded but should be loaded from the computer environment
 * for security reasons...
*/
var env = 'DEV'; // PROD

 exports.errorHandler = function(err,req,res,next){
 	if(env==='DEV'){
      	console.log(err);
      	return res.status(500).json(err)
      }
    else 
      return res.status(500).json('Veuillez nous excuser de ce petit probleme ...')
 }