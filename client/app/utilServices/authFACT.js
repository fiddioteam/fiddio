angular.module('fiddio')

.factory('Authentication', ['$rootScope', '$q','$http', '$location','UserData', function($rootScope, $q, $http, $location, UserData) {

  function resolveAuth(auth) {
    auth = auth || this.checkAuth();
    return auth.then( function() {
      if (UserData.getItem('authenticated')) {
        var redirect = UserData.getItem('authRedirect');
        var params = UserData.getItem('authRedirect_params');
        UserData.removeItem('authRedirect');
        UserData.removeItem('authRedirect_params');
        if (redirect) { $rootScope.$state.go(redirect, params); }
      } else {
        if ($rootScope.toState.name !== 'site.login') {
          UserData.setItem('authRedirect', $rootScope.toState.name);
          UserData.setItem('authRedirect_params', $rootScope.toStateParams);
          $rootScope.$state.go('site.login');
        } else {
          UserData.setItem('authRedirect', $rootScope.fromState.name);
          UserData.setItem('authRedirect_params', $rootScope.fromStateParams);
        }
        /*
        type = type || getProfileId();
        UserData.setItem('authRedirect', redirect);
        UserData.setItem('authRedirect_params', params);
        if (type) {
          // console.log('Type', type, $rootScope.$state.current.name);
          // if (!type && $rootScope.$state.current.name !== 'site.login') {
          //   $rootScope.$state.go('site.login');
          // }
          $location.path( '/api/' + type );
        }
        */
      }
    }, function(err) {
      console.log('err', err);
    });
  }

  function checkAuth() {
    return $http({method : 'GET', url: '/api/user/info'})
    .then(function(response){
      UserData.setItem( "authenticated", response.data.authenticated );
      UserData.setItem( "userInfo", response.data );
    }, function(response){
      console.log("checkAuth FAILED!", response.status, response.data);
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
    checkAuth: checkAuth,
    resolveAuth: resolveAuth,
    getProfileId: getProfileId
  };
}]);