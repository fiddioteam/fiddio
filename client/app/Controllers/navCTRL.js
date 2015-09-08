angular.module('fiddio')
  .controller('NavController', ['Authentication', 'UserData', function(Authentication, UserData) {
    var vm = this;

    vm.authenticateUser = function(type) {
      console.log("Inside authenticateUser in HomeController");
      Authentication.resolveAuth(type, 'site.ask')
      .finally(function() {
        console.log('UserData', UserData.authenticated);
      });
    };


  }]);