
/**
 * Description
 * @method exports
 * @param {} app
 * @param {} passport
 * @return 
 */
module.exports = function(app,passport){

  app.use(function(req,res,next){
    console.log(JSON.stringify(req.url))
    next()
  })
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
    console.log(' cjeck ')
      if(req.isAuthenticated()) return next();
      else return res.render('./login');
  }

  app.get('/',server.getPage_Start); 
  app.get('/login',server.getPage_Login); 
  app.get('/accueil',isAuthenticated,server.getPage_Welcome)

  app.get('/my_albums' ,isAuthenticated,server.getPage_Albums);
  app.get('/my_albumsData',isAuthenticated,server.getAlbumData)

  app.get('/downloading',isAuthenticated,server.getPage_Download);
  app.get('/get_state',isAuthenticated,server.getDownloadData);

  app.get('/photos',isAuthenticated,server.getPage_Photos)
  app.post('/view_album',isAuthenticated, server.getPhotosData)

  app.post('/photos_upload',isAuthenticated,server.savePhotos)

  app.get('/logout',server.logout)
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope :['user_photos'] }));
 // handle the callback after facebook has isAuthenticated the user
  app.get('/auth/facebook/callback',passport.authenticate('facebook', {
          successRedirect : '/#/accueil',
          failureRedirect : '/#/login'
      })
  );
  app.all('*', server.page404); 



}
