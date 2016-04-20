(function() {
    angular
        .module('notification', [])
        .service('NotificationService', NotificationService);

    function NotificationService() {

        var socket = io();

        var cbVideo = undefined;
        var cbPhoto = undefined;
        var cbTexte = undefined;

        var setCbVideo = function (callback) {
            cbVideo = callback;
        };
        var setCbPhoto = function (callback) {
            cbPhoto = callback;
        };
        var setCbTexte = function (callback) {
            cbTexte = callback;
        };

        var connect = function (numero, role) {
            socket.emit('authentification', {
                numero: numero,
                role: role
            });
        };

        var envoieFicheReflexe = function (numero, lien) {
            socket.emit('envoiFicheReflexeOperateur', {
                numero: numero,
                reflexLink: lien
            })
        };

        var demanderVideo = function (numero) {
            socket.emit('demandeVideoOperateur', {
                numero: numero
            });
        };

        socket.on('demandeVideo', function (message) {
            if (cbVideo) cbVideo();
        });

        socket.on('demandePhoto', function (message) {
            if (cbPhoto) cbPhoto();
        });

        socket.on('envoiFicheReflex', function (message) {
            if (cbTexte) cbTexte(message);
        });


        return {
            connect: connect,
            setCbVideo: setCbVideo,
            setCbPhoto: setCbPhoto,
            setCbTexte: setCbTexte,
            envoieFicheReflexe: envoieFicheReflexe,
            demanderVideo: demanderVideo
        }
    }

    function initWebsocketCallback($mdBottomSheet, NotificationService) {

        NotificationService.connect("0645854712", "victime");

        NotificationService.setCbVideo(function() {
            $mdBottomSheet.show({
                templateUrl: 'src/client/accueil/bottomSheet/video.html',
                controller: function($scope, $mdBottomSheet) {
                    $scope.fermer = function () {
                        $mdBottomSheet.hide();
                    }
                }
            });
        });

        NotificationService.setCbPhoto(function() {
            $mdBottomSheet.show({
                templateUrl: 'src/client/accueil/bottomSheet/photo.html',
                controller: function($scope, $mdBottomSheet) {
                    $scope.fermer = function () {
                        $mdBottomSheet.hide();
                    }
                }
            });
        });

        NotificationService.setCbTexte(function(lienFiche) {
            $mdBottomSheet.show({
                templateUrl: 'src/client/accueil/bottomSheet/reflexe.html',
                locals: {
                    lienFiche: lienFiche
                },
                controller: function($scope, $mdBottomSheet, lienFiche) {
                    $scope.lien = lienFiche;
                    $scope.fermer = function () {
                        $mdBottomSheet.hide();
                    }
                }
            });
        });
    }
})();