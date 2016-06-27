'use strict';

angular.module('itaxiApp')
    .controller('ListTaxiAcceptCtrl', ['$rootScope', '$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', 'appDataStore', 'routes', '$state', '$timeout', '$q', '$ionicPopup',
        function ($rootScope, $scope, $logger, gmaps, taxi, $fetchData, $auth, appDataStore, routes, $state, $timeout, $q, $ionicPopup) {
            $logger.info('ListTaxiAccept Controller', 'start', true);

            $scope.listTaxi = [];

            var loadListTaxi = function () {
                $scope.listTaxi = appDataStore.collection.listTaxiAccept.all();
                console.log('$scope.listTaxi : ', $scope.listTaxi);
            };


            $scope.listTaxiGroup = [
                {logo: './images/mailinh.png', group: 'Taxi Mai Linh', call: '0438222666', star: 5.0, firstKm: '9.000', secondKm: '12.000'},
                {logo: './images/basao.jpg', group: 'Taxi Ba Sao – Morning', call: '0432202020', star: 4.8, firstKm: '9000', secondKm: '12000'},
                {logo: './images/daukhi.png', group: 'Taxi Dầu khí', call: '04363636363', star: 4.4, firstKm: '7.000', secondKm: '12.000'},
                {logo: './images/vinasun.jpg', group: 'Taxi VinaSun', call: '0436668888', star: 5.0, firstKm: '7.000', secondKm: '19.000'},
                {logo: './images/thanhcongtaxi.png', group: 'Taxi Thành Công', call: '043575757', star: 5.0, firstKm: '7.000', secondKm: '19.000'},
                {logo: './images/logo-itaxi-new.png', group: 'Taxi Thành Lợi', call: '0438551551', star: 4.5, firstKm: '9000', secondKm: '12000'}
            ];


            /*

             $scope.showConfirm = function () {
             $ionicPopup.confirm({
             title: 'Xác nhận',
             content: 'Bạn có chắc thực hiện cuộc gọi này?'
             }).then(function (res) {
             if (res) {
             console.log('You are sure');
             } else {
             console.log('You are not sure');
             }
             });
             };
             */


            /*
             *  Start controller
             * */
            loadListTaxi();

            $rootScope.$on('taxi:leave:room', function (data) {
                $logger.info('taxi:leave:room', appDataStore.collection.listTaxiAccept.all());
                loadListTaxi();
            });


            $scope.showConfirmCall = function (taxi) {
                $ionicPopup.show({
                    title: 'Conductor : '+ taxi.fullname,
                    subTitle: '¿Quieres ver la información para conducir?',
                    scope: $scope,
                    buttons: [
                        { text: 'Ver Perfil', onTap: function (e) {
                            $rootScope.goToPage('app.driverInfo', {id: taxi.id})
                        } },
                        {
                            text: '<b>Acepta el taxi</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                $rootScope.chooseTaxi(taxi);
                            }
                        }
                    ]
                }).then(function (res) {
                    console.log('Tapped!', res);
                }, function (err) {
                    console.log('Err:', err);
                }, function (msg) {
                    console.log('message:', msg);
                });


            };
        }]);