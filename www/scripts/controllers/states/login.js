'use strict';

angular.module('itaxiApp')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', '$ionicLoading', '$timeout', '$state',
        function ($rootScope, $scope, $logger, gmaps, taxi, $fetchData, $auth, $ionicLoading, $timeout, $state) {

            $logger.info('Login Controller', 'start', true);


            // get Data login from template
            $scope.login = function (loginData) {

                var username, password;


                if (!loginData || !loginData.username || !loginData.password) {
                    $rootScope.notify('Por favor, introduzca la información completa');
                } else {
                    username = loginData.username;
                    password = loginData.password;


                    $rootScope.notify('Ingresar al sistema', 2000);
                    // function login from vsoft.js

                    $auth.login(username, password, function (err, result) {

                        if (err) {
                            $rootScope.notify('Nombre de usuario o contraseña es incorrectos ', 2000);
                            loginData.username = '';
                            loginData.password = '';
                        }
                        else {
                            $rootScope.isLogin = true;
                            $rootScope.notify('Inicio de sesión exitoso ', 2000);
                            $state.go('app.home');
                        }
                    });
                }

            };

        }]);