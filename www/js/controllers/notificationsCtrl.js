angular.module('appYouper.notificationsCtrl', [])
    .controller('notificationsCtrl', function ($scope, $http, $ionicPopup) {
        $scope.notifications = [];
        $scope.notifications = JSON.parse(localStorage.getItem('youperNotifications'));
        $scope.loading = false;
        $scope.showList = true;
        $scope.details = {};
        $scope.user = {
            name: '',
            avatar: '',
            id: ''
        };

        //Get user data
        var user = JSON.parse(localStorage.getItem('youperUser'));
        $scope.user = user;

        $scope.view = function (item) {
            $scope.showList = false;
            $scope.details = item;
        }

        //Save view
        $scope.close = function () {
            $scope.showList = false;
            $scope.loading = true;
            var url = 'https://us-central1-youper-challenge-app.cloudfunctions.net/app';
            var path = '/notifications-save';
            var data = {
                userId: $scope.user.id,
                notificationId: $scope.details.id
            }
            $http.post(url + path, data, {})
                .then((res) => {
                    $scope.verifyNotifications();
                })
        }

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

                    //Save notifications locally
                    localStorage.setItem('youperNotifications', JSON.stringify($scope.notifications));

                    //Hide loading
                    if ($scope.notifications.length > 0) {
                        window.location.reload()
                    }
                    else {
                        $ionicPopup.alert({
                            title: 'Ops!',
                            template: 'There are no new notifications.',
                            buttons: [
                                {
                                    text: '<b>Ok</b>',
                                    type: 'button-positive',
                                    onTap: function () {
                                        $scope.back()
                                    }
                                }
                            ]
                        });
                    }
                })
        }

        //Back
        $scope.back = function () {
            window.history.back();
        }
    })