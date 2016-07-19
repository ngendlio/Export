/**/
// on specifie aussi k l on utilise le module ngRoute pour faire le SPA
var app = angular.module('photoExport', ['ngRoute']);
//Les chemins
app.config(['$routeProvider',function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl : '/login',
    controller  : 'loginCtrl'
  })
  .when('/accueil', {
    templateUrl : '/accueil',
    controller  : 'accueilCtrl'
  })
  .when('/my_albums', {
    templateUrl : '/my_albums',
    controller  : 'myAlbumCtrl'
  })
  .when('/auth_facebook', {
    templateUrl : '/auth_facebook'
  })
  .when('/photos', {
    templateUrl : '/photos',
    controller  : 'photosCtrl'
  })
  .when('/downloading', {
    templateUrl : '/downloading',
    controller  : 'downloadCtrl'
  })
  .when('/logout', {
    templateUrl : '/logout',
    controller  : 'logoutCtrl'
  })
  .otherwise({redirectTo: '/accueil'});

}]);

/* TIME FILTER */
    app.filter('human_readable_time', function() {
      return function(input) {

        //get milliseonds from 1 january 1970
        var output = (new Date().getTime()/1000 - new Date(input).getTime()/1000).toFixed(0);
        var secondsInMinute= 60,
          secondsInHour=secondsInMinute*60,
          secondsInDay= secondsInHour * 24,
          secondsInMonth =secondsInDay*31,
          secondsInYear =secondsInMonth*12;

        var time;
        if(output < secondsInMinute) 
          time = output+' secondes'
        else if(output < secondsInHour) // < 1 heure
          time = (output/secondsInMinute).toFixed(0)+' minutes'
        else if(output < secondsInDay) // < a un jour
          time = (output/secondsInHour).toFixed(0)+' heures'
        else if(output < secondsInMonth)
          time = (output/secondsInDay).toFixed(0)+' jours'
        else if(output < secondsInYear)
          time = (output/secondsInMonth).toFixed(0)+' mois'
        else 
          time = (output/secondsInYear).toFixed(0)+' ans'
        return 'Il y\'a '+time
      }
    });

app.factory('listPhotos', function() {
  var selectedPhotos = [];

  var liste = {};
  liste.addPhoto = function(photo_id) {
    if(selectedPhotos.indexOf(photo_id) !=-1) // if the photo is 
        selectedPhotos.splice(selectedPhotos.indexOf(photo_id),1);
    else 
      selectedPhotos.push(photo_id);
    return true;
  };
  liste.getSelectedPhotos = function() {
    return selectedPhotos;
  }
  liste.clean = function() {
    selectedPhotos =[];
    return true;
  }
  liste.isEmpty = function(){ return selectedPhotos.length === 0;}

  return liste; // returning this is very important
});

app.controller('accueilCtrl', function($scope,$window, $timeout){
    
    let delay =13000;
    $timeout(function(){$scope.showButton=true},delay);
    $timeout(function(){$scope.message ="Vos photos vous sont chères "},delay-12000);
    $timeout(function(){$scope.message ="ce sont des moments qui vous ont marqué"},delay-8000);
    $timeout(function(){$scope.message ="nous vous aidons à bien s'en occuper"},delay-4000);
     
});

app.controller('loginCtrl', function($scope, $timeout){
    
      $timeout(function(){$scope.hello=true;},1000);
      $timeout(function(){$scope._button=true;},3000);
});

app.controller('myAlbumCtrl',function($scope,$http,$location,$timeout,$window){
    $scope.no_album = false;

    $scope.getAlbums = function(){
      $scope.loading =true;
      $http.get('/my_albumsData')
      .then(function(response){
        //small hack . because angular doesn't catch the error code..
        if(response.data.indexOf('_loginPage')> -1)
          $window.location.href='/#/login'
        
        $scope.loading =false;
        if(response.data[0].length ==0){
          $scope.no_album =true;
          return;
        }
        $scope.listAlbums = response.data[0].albums;
        $scope.token =response.data[0].token;
        
      })
      .catch(function(error)
        {
          $scope.loading =false;
          $scope.error =true;
          alert(JSON.stringify(error));          
          switch(error.status){
            case -1: $scope.error_msg ='Echec de connexion';break;
            default :$scope.error_msg =error.data;$timeout(function(){$scope.erreur='';},3000);break;
          }  
        });
    };
    $scope.getAlbums();
});

//photosCtrl

app.controller('photosCtrl', function($scope,$routeParams,$timeout,$window, $http,listPhotos){
   
    $scope.getPhotos = function(url){
      //alert(' '+url)
      $scope.loading =true;
      $http.post('/view_album',{album_url:url})
      .then(function(response){   

        //small hack because angular doesn't catch the error code..
        if(response.data.indexOf('_loginPage')> -1)
          $window.location.href='/#/login'
        
        $scope.loading =false;
        if(response.data[0].length ==0 ){
          $scope.pic_available =false;
          return;
        }
        $scope.myPhotos = response.data[0].photos;
        $scope.token =response.data[0].token;
        $scope.previous = response.data[0].paging.previous;
        $scope.next = response.data[0].paging.next;

      })
      .catch(function(error)
      {
        $scope.loading =false;
        switch(error.status){
            case -1: $scope.erreur ='Echec de connexion';break;
            default :$scope.erreur =error.data;$timeout(function(){$scope.erreur='';},10000);break;
          } 
      }) 
    }
    $scope.selectionner =function(photo_id){
       listPhotos.addPhoto(photo_id)
       //update the number of selected pictures
       $scope.selectedPics =listPhotos.getSelectedPhotos().length;
    }
    $scope.isSelected= function(photo_id){
        return listPhotos.getSelectedPhotos().indexOf(photo_id) > -1
    }
    $scope.isModeSelection = function(){
      return !listPhotos.isEmpty();
    }
    $scope.save = function(){
      //alert("START ")
      if(listPhotos.isEmpty()) return false;
      $http.post('/photos_upload',{"selectedPics":listPhotos.getSelectedPhotos()})
      .then(function(response){
       // alert("reponse serveur "+JSON.stringify(response.data))
        $window.location.href = '#/downloading';
        listPhotos.clean(); // efface les photos selectionnees
      })
      .catch(function(error){
        switch(error.status){
            case -1: $scope.erreur ='Echec de connexion';break;
            default :$scope.erreur =error.data;$timeout(function(){$scope.erreur='';},3000);break;
          } 
      })  
    }
    $scope.selectedPics =listPhotos.getSelectedPhotos().length;
    $scope.getPhotos('https://graph.facebook.com/'+$routeParams.album_id+'/photos');
});

app.controller('logoutCtrl', function($scope, $http,$window){
    
    $http.get('/logout')
    .then(function(response){
      $window.location.href = '#/login';
      //alert(' you are now deconnected')
    })
    .catch(function(error){
      alert('Une erreur est survenue ')

    })  
});
//
app.controller('downloadCtrl', function($scope, $http,$timeout,$window){

    $scope.getUploadState = function(){
      $http.get('/get_state')
      .then(function(response){
        //alert(JSON.stringify(response.data))

          $scope.error=false;
          // we get an object containing download info_
          if(response.data == null){
            $scope.downloading= false;
            //alert(' received null data')
            $timeout(function(){$window.location.href ='/#/my_albums'},4000);
            return;
          }
          else{
            //alert(JSON.stringify(response.data))
            $scope.success =response.data.nb_items_success;
            $scope.total = response.data.nb_items;
            $scope.percent =((response.data.nb_items_success+response.data.nb_items_error)*100/response.data.nb_items).toFixed(0);
            
            $scope.downloading= !response.data.finished;
            
            if(isNaN($scope.percent) || $scope.percent < 0)
              $scope.percentage =0;
            else 
              $scope.percentage = $scope.percent;

            if($scope.downloading && !$scope.error)
              $timeout(function(){$scope.getUploadState();},1000);
          }
      })
      .catch(function(error){
        $scope.error=true;
        switch(error.status){
            case -1: $scope.error_msg ='Echec de connexion';break;
            default :$scope.error_msg =error.data;$timeout(function(){$scope.error_msg='';},3000);break;
          }  
      });  
    }

  $scope.getUploadState();
   
});