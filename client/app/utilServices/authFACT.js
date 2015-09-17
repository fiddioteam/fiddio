angular.module('fiddio')

.factory('Authentication', ['$rootScope', '$q','$http', '$location', function($rootScope, $q, $http, $location) {
  function loadAuth() {
    $rootScope.userData.authenticated = $rootScope.userData.getItem('userInfo').authenticated;
  }

  function checkAuth() {
    return $http({method : 'GET', url: '/api/user/info'})
    .then(function(response){
      var userInfo = $rootScope.userData.getItem('userInfo') || {};
      angular.forEach(response.data, function(v, k) {
        userInfo[k] = v;
      });
      $rootScope.userData.setItem('userInfo', userInfo);
      $rootScope.userData.authenticated = userInfo.authenticated;

      return response;
    }, function(response){
      console.log("Error in authorization check", response.status, response.data);
    });
  }

  var authMethods = ['gh', 'fb', 'mp'];

  /**
   * Returns authMethod from localStorage based on stored profile id
   * If not available, will return null
   * @return {string}
   *
   * authMethods = 'gh', 'fb', 'mp'
   * Notes: '!memo[0]' is shorthand for memo.length > 0
   */
  function getProfileId() {
    var userInfo = $rootScope.userData.getItem('userInfo');
    for (var i = 0; i < authMethods.length; i++) {
      var id = userInfo[authMethods[i] + '_id'];
      if (id) { return authMethods[i]; }
    }

    return null;
  }

  return {
    loadAuth: loadAuth,
    checkAuth: checkAuth,
    getProfileId: getProfileId
  };
}]);