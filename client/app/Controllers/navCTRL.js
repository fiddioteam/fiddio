angular.module('fiddio')
  .controller('NavController', ['Authentication', '$rootScope', '$http', function(Authentication, $rootScope, $http) {
    var vm = this;

    vm.userData = $rootScope.userData;

    vm.logout = function() {
      $http({ method: 'GET', url: '/api/logout'})
      .then(function(response){
        $rootScope.userData.setItem('authenticated', false);
        $rootScope.userData.setItem('userInfo', { authenticated: false });
        $rootScope.$state.go('logout');
      }, function(response) {
        console.log("Logout error: ", response);
      });
    };

  }]);