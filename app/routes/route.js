
/**
 * Description
 * @method exports
 * @param {} app
 * @param {} passport
 * @return 
 */
module.exports = function(app,passport){


  var server = require ('../controllers/serverController');

  /**
   * Description
   * @method isAuthenticated
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  var isAuthenticated = function(req,res,next){
      if(req.isAuthenticated()) return next();
      else return res.render('./login');
  }
  //Home page
  app.get('/',server.getPage_Start); 

  /* AUthenticated routes*/

  //Page to welcome the user after authentication
  app.get('/accueil',isAuthenticated,server.getPage_Welcome)
  // Albums page
  app.get('/my_albums' ,isAuthenticated,server.getPage_Albums);
  app.get('/my_albumsData',isAuthenticated,server.getAlbumData);
  //get page of album's photos
  app.get('/photos',isAuthenticated,server.getPage_Photos)
  // get the list of photos of this album
  app.post('/view_album',isAuthenticated, server.getPhotosData)
  //when the user decides to save selectedPhotos
  app.post('/postSavePhotos',isAuthenticated,server.savePhotos)
  //page that shows the state of the download
  app.get('/downloading',isAuthenticated,server.getPage_Download);
  //get state of the current download
  app.get('/get_state',isAuthenticated,server.getDownloadData);

/* Unauthenticated routes*/
  // Login page
  app.get('/login',server.getPage_Login); 
  // loging out
  app.get('/logout',server.logout)
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope :['user_photos'] }));
 // handle the callback after facebook has isAuthenticated the user
  app.get('/auth/facebook/callback',passport.authenticate('facebook', {
          successRedirect : '/#/accueil',
          failureRedirect : '/#/login'
      })
  );
  //404 error handling controller..
  app.all('*', server.page404); 
}
