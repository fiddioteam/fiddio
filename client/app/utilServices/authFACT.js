angular.module('fiddio')

.factory('Authentication', [
  '$rootScope',
  '$q',
  '$http',
  '$location',
  function($rootScope, $q, $http, $location) {

    function loadAuth() {
      var userInfo = $rootScope.userData.getItem('userInfo');
      if (!userInfo) {
        userInfo = { authenticated: false };
        $rootScope.userData.setItem('userInfo', userInfo);
      }
      $rootScope.userData.authenticated = userInfo.authenticated;
    }

    function checkAuth() {
      return $http({method : 'GET', url: '/api/user/info'})
      .then( function(response) {
        var userInfo = $rootScope.userData.getItem('userInfo') || {};
        angular.forEach(response.data, function(v, k) {
          userInfo[k] = v;
        });
        $rootScope.userData.setItem('userInfo', userInfo);
        $rootScope.userData.authenticated = userInfo.authenticated;
        return response;
      }, function(response) {
        console.error("Error in authorization check", response.status, response.data);
      });
    }

    return {
      loadAuth: loadAuth,
      checkAuth: checkAuth
    };
}]);