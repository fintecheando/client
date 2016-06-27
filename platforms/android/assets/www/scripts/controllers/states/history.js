'use strict';

angular.module('itaxiApp')
    .controller('HistoryCtrl', ['$rootScope', '$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', '$ionicActionSheet', '$ionicModal', '$baseModel',

        function ($rootScope, $scope, $logger, gmaps, taxi, $fetchData, $auth, $ionicActionSheet, $ionicModal, $baseModel) {

            $logger.moduleName = 'History Controller';
            $scope.checkHistory = true;
            $scope.addReportProcess = false;
            $scope.reportContent = '';
            $logger.info('History Controller', 'start', true);

            $scope.allHistory = null;
            var loadHistory;

            //Load history from Schema RouteHistories

            loadHistory = function () {
                // get User id from AppRegisterInfo

                var userId = $auth.getAppRegisterInfo().id;
                // filter
                var filter = [
                    {
                        property: 'customer',
                        value: userId,
                        type: 'string',
                        comparison: 'eq'
                    },
                    {
                        property: 'status',
                        value: 5, // status route has been destroy
                        type: 'number',
                        comparison: 'ne' // Not Equal
                    }
                ];

                var sorter = [
                    {
                        property: 'endAt', // time
                        direction: 'DESC'
                    }
                ];
                $fetchData.getData('RouteHistories', 0, 1000, filter, sorter).then(function (result) {
                    if (result.all().length > 0) {
                        $scope.listHistory = result.all();
                        $scope.allHistory = result;
                    } else {
                        $scope.checkHistory = false;
                    }
                })
            };

            $scope.selectedRouteId = null;

            // get status route

            $scope.filterStatus = function (stt){
                switch(stt){
                    case 0:
                        return 'Espera';
                        break;

                    case 1:
                        return 'Funcionamiento';
                        break;

                    case 2:
                        return 'Logro';
                        break;

                    case 3:
                        return 'Cancelada por el cliente';
                        break;

                    case 4:
                        return 'Cancelado por el conductor';
                        break;


                }
            };

            //create Report

            $scope.addReport = function (reportContent){
                $scope.addReportProcess = true;

                var saveData = new $baseModel('Reports', {
                    content: reportContent,
                    date: new Date(),
                    route: $scope.selectedRouteId,
                    user : $auth.getAppRegisterInfo().id
                });

                saveData.save(function (err, resp){
                    $scope.addReportProcess = false;

                    if(!err){
                        $rootScope.notify('Su respuesta ha sido enviada!');
                    }else {
                        $rootScope.notify('¡Error! Inténtelo de nuevo más tarde');
                    }
                })
            };


            $ionicModal.fromTemplateUrl('views/utils/historyDetailModal.html', function (modal) {
                $scope.modal = modal;

            }, {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false
            });

            $scope.selectHistory = function (routes) {
                $scope.selectedRouteId = routes.id;
                $ionicActionSheet.show({
                    /*titleText: 'Lịch sử lộ trình',*/
                    buttons: [
                        { text: 'Ver detalles' }
                    ],
                    destructiveText: 'Eliminar esta hoja de ruta',
                    cancelText: 'Cancelar',
                    cancel: function () {
                        console.log('CANCELLED');
                    },
                    buttonClicked: function (index) {
                        if (index == 0) {

                            $scope.modal.show();
                            $scope.detailHistory = $scope.allHistory.get($scope.selectedRouteId);
                            console.log('$scope.detailHistory', $scope.detailHistory);
                            console.log('hello world');
                            return true;
                        }
                    },
                    destructiveButtonClicked: function () {
                        if (routes.status == 0 || routes.status == 1) {
                            $rootScope.notify('Plan de trabajo sin terminar, no puede borrar');
                        } else {

                            $rootScope.notify('Eliminando ..', true);


                            routes.status = 5;
                            routes.save(function (err, result) {
                                if (err) {
                                    $logger.info('destroyHistory', 'success', false, err);
                                } else {

                                    $scope.listHistory.splice($scope.listHistory.indexOf(routes), 1);
                                    $rootScope.hideNotify();
                                    $logger.info('destroyHistory', 'success', true, result);
                                }
                            });
                        }
                        return true;
                    }
                });
            };

            loadHistory();

        }]);