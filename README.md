/*
 * This App has 3 main folders :
 * 1) app : containing all the MVC(views, models,controllers, and routes)
 * 2) config: contains all the setup options used for this application(security, config,environment modules)
 * 3) public: containing public accessible files, like css,front-end scripts
 * 4) download: All downloaded images fomr facebook are stored in this Folder 0_o
 * 
* Sessions are managed by Express-session ie a server-side based session
* Sessions should be stored in memorycached or redis Stores because it is not recommended to use the in-memory * to store sessions but in this example i used in memory to store sessions for EASE resaons
* Also when the server restarts all the sessions are cleaned
*
*
* Templating : I used the NODE template engine JADE
*  Ps: Sorry, i am not good at choosing colors. 
*
* To use it i registered an app on facebook, but it only works for me because  i have not got time to wait for * the LOGIN REVIEW from facebook that would authorize other users to use my application.
*
*
*** You should create your own application and put your ClientID , clientSecret in the confif file
*** then you should get access to all the features of the application.
*
*
* We have a User schema,model (see: app/models/user.js) 
* I used mongoose ORM.
*
*
* Features:
**   - get your Albums 
**   - get photos from an album
**   - save photos from different albums in the same time in asynchrnouus manner
*
*
*** For storage 
*** Photos are saved in a download folder. Make sure that you grant read/write access to this folder by doing
*** sudo chmod 777 <folder_name> if you are under a linux based OS.
*** I did not use AWS Storage because to have a Bucket you provide credit card info. And i have none. o_0
*** MONGO PORT default port number is used : i.e   27017
*
*********\ That's all! Just nodemon server.js it and you're done.
*
** I am open to all remarks: https://www.facebook.com/lio.ngend
*
*/

