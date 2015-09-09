angular.module('fiddio')
  .controller('NavController', ['Authentication', 'UserData', function(Authentication, UserData) {
    var vm = this;

    // vm.authenticateUser = function(type) {
    //   Authentication.resolveAuth(type, 'site.ask')
    //   .finally(function() {
    //     console.log('UserData', UserData.authenticated);
    //   });
    // };


  }]);