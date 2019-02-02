angular.module('appYouper.homeCtrl', [])
    .controller('homeCtrl', function ($scope, $state, $ionicPopup, $cordovaCamera, $ionicLoading, FirebaseDB, $ionicPlatform, $http, $timeout) {
        // Models
        $scope.user = {
            name: '',
            avatar: '',
            id: ''
        };
        $scope.chat = [];
        $scope.message = '';
        $scope.notifications = [];
        $scope.notificationAlert = false;
        $scope.loading = true;

        //Get user data
        var user = JSON.parse(localStorage.getItem('youperUser'));
        $scope.user = user;

        //Verify notifications
        $scope.verifyNotifications = function () {
            var url = 'https://us-central1-youper-challenge-app.cloudfunctions.net/app';
            var path = '/notifications';
            var data = {
                id: $scope.user.id
            };
            $http.post(url + path, data, {})
                .then((res) => {
                    $scope.notifications = [];
                    let data = res.data;
                    let i = 0;
                    for (i; i < data.length; i++) {
                        if (data[i].viewed == false) {
                            $scope.notifications.push(data[i]);
                        }
                    }

                    if ($scope.notifications.length > 0) {
                        $scope.notificationAlert = true
                    }
                    else {
                        $scope.notificationAlert = false
                    }

                    //Save notifications locally
                    localStorage.setItem('youperNotifications', JSON.stringify($scope.notifications));

                    //Hide loading
                    $timeout(function () {
                        $scope.loading = false;
                    }, 2000)
                })
        }

        //Init screen
        $scope.$on('$ionicView.enter', function () {
            $scope.verifyNotifications();
        });

        //Init screen - first
        $scope.$on('$ionicView.loaded', function () {
            $timeout(function () {
                $scope.sendMessage('init');
            }, 1000)
        });

        //Go to notifications
        $scope.goToNotifications = function () {
            $state.go('notifications')
        }

        //No notifications
        $scope.alertNotifications = function () {
            $ionicPopup.alert({
                title: 'Ops!',
                template: 'There are no new notifications.'
            });
        }

        //Upload image
        $scope.getImage = function () {

            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                mediaType: Camera.MediaType.PICTURE
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                //Loading
                $ionicLoading.show({
                    template: 'Loading...'
                });

                var image = "data:image/jpeg;base64," + imageData;
                //Call to upload image function
                uploadImage(image, new Date());
            }, function (error) {
            });
        }

        //Upload image
        function uploadImage(_image, _title) {
            // modify the image path when on Android
            if ($ionicPlatform.is("android")) {
                _image = "file://" + _image
            }

            return fetch(_image).then(function (_data) {
                return _data.blob()
            }).then(function (_blob) {
                uploadTask = FirebaseDB.storage().ref('images/' + _title + '.jpg').put(_blob)

                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                }, function (error) {
                    // Handle unsuccessful uploads
                    return error
                }, function () {
                    // Handle successful uploads on complete..
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    $scope.user.avatar = downloadURL;

                    //Save user data
                    saveUser();

                    //Reload
                    // location.reload();

                    //Hide loading
                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 300)
                });
            })
        };

        function saveUser() {
            localStorage.setItem('youperUser', JSON.stringify($scope.user));
        }

        //Send message to API AI
        $scope.sendMessage = function (ev) {
            //Loading
            // $ionicLoading.show({
            //     template: 'Loading...'
            // });

            var message = '';
            if (ev === 'init') {
                message = 'hello';
                send(message);
            }
            else {
                message = $scope.message;
                if (message.length == 0) {
                    //Hide loading
                    // $ionicLoading.hide()

                    var alertPopup = $ionicPopup.alert({
                        title: 'Ops!',
                        template: 'Please enter something before sending.'
                    });
                }
                else {
                    $scope.message = '';
                    var data = {
                        message: message,
                        from: 'user',
                        createdAt: new Date()
                    };
                    $scope.chat.push(data);
                    send(message);
                }
            }
        }

        function send(message) {
            $http.get('https://api.dialogflow.com/v1/query?v=20150910&lang=en&query= ' + message + '&sessionId=' + $scope.user.id, {
                headers: {
                    'Authorization': 'Bearer 084ae61712154b84a392ea8278783c6c'
                }
            }).then(function (result) {

                $timeout(function () {
                    var data = {
                        message: result.data.result.fulfillment.speech,
                        from: 'youper',
                        createdAt: new Date()
                    };
                    $scope.chat.push(data);

                    //Hide loading
                    // $ionicLoading.hide()
                }, 700)
            }, function (error) {
            })
        }

        //Change name
        $scope.changeName = function () {
            $ionicPopup.show({
                template: '<input type="text" ng-model="user.name">',
                title: 'Change name',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function () {
                            localStorage.setItem('youperUser', JSON.stringify($scope.user));
                        }
                    }
                ]
            });
        }

        // Refresh page
        $scope.refreshPage = function () {
            window.location.reload()
        }
    })
