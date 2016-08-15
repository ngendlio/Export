# ExportPic
This App has 3 main folders :

1. app : containing all the MVC(views, models,controllers, and routes)
2. config: contains all the setup options used for this application(security, config,environment modules)
3. public: containing public accessible files, like css,front-end scripts
4. download: All downloaded images fomr facebook are stored in this Folder 0_o.


## Sessions
 Sessions are managed by Express-session ie a server-side based session
 Sessions should be stored in `memcached` or `redis` stores because it is not recommended to use the in-memory  to store sessions but in this example i used in memory to store sessions to not oblige you to install redis to test the application.
 `Notice`: That's why, when the server restarts all the sessions are cleaned.

## Template engine
 Templating : I used the NODE template engine JADE
 
 Ps: Sorry, i am not good at choosing colors. 
 
## How to use
First, i registered my application in facebook, but it only works for my account because i have not got time to wait for  the `LOGIN REVIEW` from facebook that is  required to authorize my application to access others facebook account users.

So, i have given you credentials to do all the test with an account(ready-to-go) i especially created for that purpose.

For the DB, I user Mongo DB and mongoose as the ORM.

So the application requires that you have a mongo DB instance running at localhost and at the default port `mongodb://127.0.0.1/`.

I have a User schema,model (see: app/models/user.js) 
 I used mongoose ORM.

### Features:
* get your Albums 
* get photos from an album
* save photos from different albums in the same time in an `asynchronous way`


 ## Photo Storage 
 Photos are saved in a download folder. Make sure that you grant read/write rights to this folder by doing  in you are under a linux based OS.
```
 sudo chmod -R 777 <folder_name> 
```

 I did not use `AWS Storage` because to get a Bucket you provide credit card info during regitration. And i  don't have a  credit card yet. o_0
 
 That's all! Just do:
```javascript
nodemon server.js
```
And you're done.

I am open to all remarks: [https://www.facebook.com/lio.ngend](Lionel)



