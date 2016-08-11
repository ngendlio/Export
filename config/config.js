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
    clientID:'833829753419759',
    clientSecret:'bacb8d037f3e70e09ccf5a2b760f25ef',
    callBackUrl:'http://localhost:12016/auth/facebook/callback'
  },

};