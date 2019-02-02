angular.module('appYouper.services', [])

    .factory('FirestoreService', function ($q, $state, $timeout, $ionicPlatform) {
    })

    .factory('FirebaseDB', function ($q, $state, $timeout) {
        var instance, storageInstance, unsubscribe, currentUser = null
        var initialized = false

        return {
            initialize: function () {

                // Not initialized so... initialize Firebase
                var config = {
                    apiKey: "AIzaSyA_Tmoz-uLWAUJFJMhGONq2P2KZAwrWtSs",
                    authDomain: "youper-challenge-app.firebaseapp.com",
                    databaseURL: "https://youper-challenge-app.firebaseio.com",
                    projectId: "youper-challenge-app",
                    storageBucket: "youper-challenge-app.appspot.com",
                    messagingSenderId: "873291861478"
                };

                // initialize database and storage
                instance = firebase.initializeApp(config);
                storageInstance = firebase.storage();
            },
            storage: function () {
                return storageInstance
            }
        }
    })