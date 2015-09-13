angular.module('fiddio')

.factory('Authentication', ['$rootScope', '$q','$http', '$location', function($rootScope, $q, $http, $location) {

  function checkAuth() {
    return $http({method : 'GET', url: '/api/user/info'})
    .then(function(response){
      $rootScope.userData.setItem( "authenticated", response.data.authenticated );
      $rootScope.userData.setItem( "userInfo", response.data );
      $rootScope.userData.authenticated = response.data.authenticated;
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
    var userInfo = $rootScope.userData.getItem('userData');
    return (userInfo &&
      authMethods.reduce(function(memo, item) {
        return (!memo[0] && memo) || (!(userInfo[item + '_id'] + '')[0] && item);
      }, '')) || null;
  }

  return {
    checkAuth: checkAuth,
    getProfileId: getProfileId
  };
}]);