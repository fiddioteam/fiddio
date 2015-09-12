angular.module('fiddio')
  .controller('NavController', ['Authentication', 'UserData', '$rootScope', '$http', function(Authentication, UserData, $rootScope, $http) {
    var vm = this;

    // vm.authenticateUser = function(type) {
    //   Authentication.resolveAuth(type, 'site.ask')
    //   .finally(function() {
    //     console.log('UserData', UserData.authenticated);
    //   });
    // };
    vm.authenticated = $rootScope.authenticated;

    vm.logout = function() {
      $http({ method: 'GET', url: '/api/logout'})
      .then(function(response){
        $rootScope.authenticated = false;
        vm.authenticated = false;
        UserData.removeItem('authenticated');
        UserData.removeItem('userInfo');
        $rootScope.$state.go('logout');
      }, function(response) {
        console.log("Logout error: ", response);
      });
    };

  }]);