'use strict';
let DBName ='PhotoApp'
module.exports = {
  // in case of redis is used
  // redis:
  //   {
  //     host: '127.0.0.1',
  //     port: 6379,
  //     pass:'chooseTheBestPassword',
  //     ttl : 260,
  //   },
  mongo:
  {
    url:'mongodb://127.0.0.1/'+DBName, //
  },
    /*  You shoud use your own clientID and ClientSecret*/
  'fb_auth':{
    clientID:'1820181531545249',
    clientSecret:'a9387ea28cbac5e453b7e1b903ca6eb4',
    callBackUrl:'http://localhost:12016/auth/facebook/callback'
  },

};