angular.module('fiddio')

.controller('NavController', [
  'Authentication',
  '$rootScope',
  '$http',
  function(Authentication, $rootScope, $http) {
    var vm = this;

    vm.userData = $rootScope.userData;

    vm.logout = function() {
      $http({ method: 'GET', url: '/api/logout' })
      .then( function(response) {
        var userInfo = { authenticated: false };
        $rootScope.userData.setItem('userInfo', userInfo);
        $rootScope.userData.authenticated = false;
        $rootScope.$state.go('logout');
      }, function(error) {
        console.error("Error", error);
      });
    };
}]);