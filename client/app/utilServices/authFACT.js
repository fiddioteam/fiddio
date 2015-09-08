angular.module('fiddio')

.factory('Authentication', ['$rootScope', '$q','$http', '$location','UserData', function($rootScope, $q, $http, $location, UserData) {

  function resolveAuth(type,redirect, params) {
    return checkAuth()
    .then( function() {
      if (UserData.getItem('authenticated')) {
        redirect = redirect || UserData.getItem('authRedirect');
        params = params || UserData.getItem('authRedirect_params');
        UserData.removeItem('authRedirect');
        UserData.removeItem('authRedirect_params');
        if (redirect) { $rootScope.$state.go(redirect, params); }
      } else {
        UserData.setItem('authRedirect', redirect);
        UserData.setItem('authRedirect_params', params);
        type = type || getProfileId();
        console.log('Type', type);
        $location.path( '/api/' + type );
      }
    }, function(err) {
      console.log('err', err);
    });
  }

  function checkAuth() {
    return $q(function(resolve, reject){
      $http({method : 'GET', url: '/api/user/info'})
      .success(function(data, status, headers, config){
        UserData.setItem( "authenticated", data.authenticated );
        UserData.setItem( "userInfo", data );
        resolve();
      })
      .error(function(data, status, headers, config){
        console.log("Wait, what?", status, data);
      });
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
    var userInfo = UserData.getItem('userData');
    return (userInfo &&
      authMethods.reduce(function(memo, item) {
        return (!memo[0] && memo) || (!(userInfo[item + '_id'] + '')[0] && item);
      }, '')) || null;
  }

  return {
    resolveAuth: resolveAuth,
    getProfileId: getProfileId
  };
}]);