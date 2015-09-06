angular.module('fiddio')
  .factory('Authentication', ['$rootScope', '$q','$http', '$location','UserData', function($rootScope, $q, $http, $location, UserData) {

    function resolveAuth(type,redirect, params) {
      return checkAuth()
      .then( function() {
        //console.log("Be like, what?", UserData.getItem('authenticated'));
        if (UserData.getItem('authenticated')) {
          console.log('Authenticated and going to', redirect, params);
          $rootScope.$state.go(redirect, params);
        } else {
          UserData.setItem('authRedirect', redirect);
          UserData.setItem('authRedirect_params', params);
          $location.path( '/api/' + type );
        }
      }, function(err) {
        console.log('err', err);
      });
    }

    function checkAuth() {
      return $q(function(resolve, reject){
        //console.log('Be like, call in the GETs');
        $http({method : 'GET', url: '/api/user/info'})
        .success(function(data, status, headers, config){
          UserData.setItem( "authenticated", data.authenticated );
          UserData.setItem( "userInfo", data );
          console.log('data', data);
          resolve();
        })
        .error(function(data, status, headers, config){
          //Redirect
          console.log("Wait, what?", status, data);
        });
      });
    }

    return {
      resolveAuth: resolveAuth
    };
  }]);