angular.module('appYouper.routes', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            /* INTRO ***********************************************************/
            .state('intro', {
                url: '/intro',
                templateUrl: 'templates/intro/intro.html',
                controller: 'introCtrl'
            })

            /* HOME ***********************************************************/
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home/home.html',
                controller: 'homeCtrl'
            })

             /* NOTIFICATIONS ***********************************************************/
             .state('notifications', {
                url: '/notifications',
                templateUrl: 'templates/notifications/notifications.html',
                controller: 'notificationsCtrl'
            });
        /********************************** END ********************************************/

        /* DEFAULT ***********************************************************/
        $urlRouterProvider.otherwise('/intro');
    });
