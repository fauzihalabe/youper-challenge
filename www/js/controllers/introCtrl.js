angular.module('appYouper.introCtrl', [])
    .controller('introCtrl', function ($scope, $state, $ionicPopup, $timeout) {
        // User model
        $scope.user = {
            name: '',
        };
        $scope.userName = '';
        $scope.show = true;
        $scope.init = false;

        //Verify and apply user data
        $timeout(function () {
            $scope.init = true;
            $scope.userName = JSON.parse(localStorage.getItem('youperUser')).name;

            $timeout(function () {
                if ($scope.userName) {
                    $scope.hideDiv()
                }
            }, 3000)
            $scope.hideDiv = function () {
                $scope.show = false;

                $timeout(function () {
                    $state.go('home')
                }, 1500)
            }
        }, 2900)

        //Save user name
        $scope.saveUserName = function () {
            var name = $scope.user.name;
            if (name.length == 0) {
                $scope.alert()
            }
            else {
                var user = {
                    name: name,
                    avatar: null,
                    id: name + new Date().getHours() + new Date().getMinutes() + new Date().getMilliseconds()
                };
                localStorage.setItem('youperLogged', 'true');
                localStorage.setItem('youperUser', JSON.stringify(user));
                $state.go('home')
            }
        };

        // Alert
        $scope.alert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Ops!',
                template: 'Please tell us your name before continuing!'
            });
        };
    })
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.views.transition('none');
    });