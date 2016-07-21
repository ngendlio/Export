var config =require('../../config/config'),
    DB = require('../models/DB')

/**
 * Description
 * @method getPage_Start
 * @param {} req
 * @param {} res
 * @return 
 */
exports.getPage_Start = function(req, res){
	res.render('./startpage')
};
/**
 * Description
 * @method getPage_Login
 * @param {} req
 * @param {} res
 * @return 
 */
exports.getPage_Login = function(req, res){
  res.render('./login')
};

/**
 * Description
 * @method getPage_Albums
 * @param {} req
 * @param {} res
 * @param {} next
 * @return 
 */
exports.getPage_Albums = function(req,res,next){
  res.render('./albums',{name:req.session.passport.user.name});
}
/**
 * Here we just make a request to get all the albums of the current user and return them to the front end
 * @method getAlbumData
 * @param {} req
 * @param {} res
 * @param {} next
 * @return 
 */
exports.getAlbumData= function(req,res,next){
  //faire rekete sur FB, puis lui donner la reponse
  var request = require('request');
 let URL ='https://graph.facebook.com/v2.7/me/albums?access_token='+req.session.passport.user.token;
    // let URL ='https://graph.facebook.com/v2.7/me/albums?access_token='+req.session.passport.user.token
    console.log(URL)
  request.get({url:URL}
    , function (erreur, response, body) {
  
      if(erreur) return next('Une erreur s\'est produite, réessayer');
      else if(response.statusCode != 200)return res.status(response.statusCode).json('Erreur survenue');
      else {   
        // be sure that results are in JSON format      
          if(isJson(body)){            
            let reponse=[];
            console.log(JSON.parse(body).data)
            reponse.push({"token":req.session.passport.user.token,"albums":JSON.parse(body).data})
            res.json(reponse)
          }
          else
           return res.status(400).json('Données recues non valides')
      }
  })
 
}

/**
 * Description
 * @method getPage_Photos
 * @param {} req
 * @param {} res
 * @param {} next
 * @return CallExpression
 */
exports.getPage_Photos = function(req,res,next){
  return res.render('./photos',{name:req.session.passport.user.name});
}
/**
 * Here we just get the list of Photos ID thatbelongs to a certain album.
 * We receive an album url and we just make the request
 * @method getPhotosData
 * @param {} req
 * @param {} res
 * @param {} next
 * @return 
 */
exports.getPhotosData= function(req,res,next){

  req.assert('album_url','Donner un URL valide').notEmpty().isURL();
  var erreurs = req.validationErrors();
  if(erreurs)
      return res.status(401).json(erreurs[0].msg);

  let request = require('request');
  //choose to add accesstoke 
  let album_url = req.body.album_url;
  if(album_url.indexOf('access_token') ==-1)
     album_url = album_url+'?access_token='+req.session.passport.user.token;
  
  request.get({url:album_url} , function (erreur, response, body) {  

      if(erreur) return next(erreur);
      else if(response.statusCode != 200)
        return res.status(response.statusCode).json(' Erreur survenue'+JSON.stringify(response));
      else {
          if(isJson(body)){            
            let reponse=[];
            reponse.push({"token":req.session.passport.user.token,"paging":JSON.parse(body).paging,"photos":JSON.parse(body).data})
            res.json(reponse)
          }
          else
           return res.status(400).json('Données recues non valides')
      }
  })
}
/**
 * Here we just delete all sessions information
 * @method logout
 * @param {} req
 * @param {} res
 * @param {} next
 * @return 
 */
exports.logout= function(req,res,next){
  if(req.session) 
    req.session.destroy();
  //logout for passport.js
  req.logout();
  res.end();
}

/**
 * Description
 * @method getPage_Welcome
 * @param {} req
 * @param {} res
 * @param {} next
 * @return CallExpression
 */
exports.getPage_Welcome= function(req,res,next){
  console.log(' Page welcome ')
  return res.render('./accueil',{name:req.session.passport.user.name,
    token:req.session.passport.user.token,user_id:req.session.passport.user.id})
}
/**
 * Here we just get the list of the photos ID to download and we we ill download them 
 * in asynchronous manner.
 * @method savePhotos
 * @param {} req
 * @param {} res
 * @param {} next
 * @return 
 */
exports.savePhotos = function(req,res,next){
  
  let selectedPics = req.body.selectedPics;
  var fs = require('fs');
  var request = require('request');
  var progress = require('request-progress');

  let async  = require("async");
  if(req.session.download) 
    return res.json(req.session.download);
  
  req.session.download ={
              nb_items: selectedPics.length,
              nb_items_success:0,
              nb_items_error:[],
              start_time: Date.now()/1000,
              finished:false,
  };
  
  // Save files in asynchronous manner to avoid blocking
  async.eachSeries(selectedPics,
    function(photo_id,callback){
      let url="https://graph.facebook.com/"+photo_id+"/picture?access_token="+req.session.passport.user.token;

    progress(request(url), {
      throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms 
      delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms 
      lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length 
    })
    .on('end', function () {
      // Do something after request finishes
      req.session.download.nb_items_success++;
      req.session.save();
      callback(null)
    })
    .on('error', function (error) {
        // Do something with err 
      req.download.session.nb_items_error.push(photo_id);
      req.session.save();
      callback(error);
    })
    .pipe(fs.createWriteStream('downloads/'+photo_id+'.jpg'));
    },
    function(err){
      //if(err) next(); // we ignore the errors here bcz they will be known
      req.session.download.finished= true;
      req.session.save();
    });

    // don t wait for all the download to finish
    res.end();
}

/**
 * Description
 * @method getDownloadData
 * @param {} req
 * @param {} res
 * @param {} next
 * @return CallExpression
 */
exports.getDownloadData = function(req,res,next){
  //Just simply return the obj containning all the information about the process
  let infos =req.session.download;
  console.log(JSON.stringify(infos))
  if(req.session.download && req.session.download.finished){

    req.session.download=null;
    return res.json(null);
  }
  return res.json(infos);

}
/**
 * Description
 * @method getPage_Download
 * @param {} req
 * @param {} res
 * @param {} next
 * @return CallExpression
 */
exports.getPage_Download = function(req,res,next){
  return res.render('./download')
}

/**
 * Description
 * @method isJson
 * @param {} str
 * @return Literal
 */
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
/**
 * Description
 * @method page404
 * @param {} req
 * @param {} res
 * @param {} next
 * @return 
 */
exports.page404 = function(req,res,next){
  //this should be reported
  res.json('Cette page nous est inconnue ');
}
