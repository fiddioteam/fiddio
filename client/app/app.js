angular.module( 'fiddio', [ 'ui.ace', 'ui.router' ] )
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '../templates/home.html'
      })
      .state('record-response', {
        url: '/record-response',
        templateUrl: '../templates/record.html',
        controller: 'AceController as ace'
      });
  });
