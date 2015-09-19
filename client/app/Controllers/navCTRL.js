angular.module('fiddio')
  .controller('NavController', ['Authentication', '$rootScope', '$http', function(Authentication, $rootScope, $http) {
    var vm = this;

    vm.userData = $rootScope.userData;

    vm.logout = function() {
      console.log('logging out');
      $http({ method: 'GET', url: '/api/logout'})
      .then(function(response){
        var userInfo = $rootScope.userData.getItem('userInfo');
        userInfo.authenticated = false;
        $rootScope.userData.setItem('userInfo', userInfo);
        $rootScope.userData.authenticated = false;
        $rootScope.$state.go('logout');
      }, function(response) {
        console.log("Logout error: ", response);
      });
    };

  }]);