angular.module('appYouper', [
  'ionic',
  'ngCordova',
  'appYouper.routes',
  'appYouper.services',
  'appYouper.introCtrl',
  'appYouper.homeCtrl',
  'appYouper.notificationsCtrl',
])

  .run(function ($ionicPlatform, FirebaseDB) {

    //Init firebase
    FirebaseDB.initialize();    

    $ionicPlatform.ready(function () {
      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

    });
  })
