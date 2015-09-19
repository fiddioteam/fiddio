angular.module('fiddio')

.run([
  '$rootScope',
  '$state',
  '$stateParams',
  '$window',
  'Authentication',
  'UserData',
  function ($rootScope, $state, $stateParams, $window, Authentication, UserData) {
    $rootScope.userData = UserData;

    /**
     * From UI Router team's comments: 
     * 'It's very handy to add references to $state and $stateParams
     * to the $rootScope so that you can access them from any scope
     * within your applications.'
     */

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    Authentication.loadAuth();

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {

      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
      $rootScope.fromState = fromState;
      $rootScope.fromStateParams = fromStateParams;

      var authenticated = $rootScope.userData.authenticated;

      if(!authenticated) {
        if ($rootScope.toState.authenticate) { event.preventDefault(); }

        Authentication.checkAuth()
        .then(function(response){
          if(!response.data.authenticated) {

            if($rootScope.toState.doNotRedirect) { // Login, auth, or logout
              if ( $rootScope.toState.name === 'login' ) { // Automatically attempt to authenticate if possible
                var profileId = $rootScope.userData.getProfileId();
                if (profileId) { $window.location.href = '/api/' + profileId; }
              }
            } else {
              // executes only when doNotRedirect is undefined, which it is for all unauthed states
              $rootScope.userData.setItem('authRedirect', $rootScope.toState.name);
              $rootScope.userData.setItem('authRedirect_params', $rootScope.toStateParams);
            }

            if ($rootScope.toState.authenticate) { // executes when authenticate flag is true, which is it for authed states ('ask', 'answer')
              $rootScope.$state.go('login');
            }

          } else if ($rootScope.toState.doNotRedirect) {
            var redirect = $rootScope.userData.getItem('authRedirect');
            var redirect_params = $rootScope.userData.getItem('authRedirect_params');
            if (redirect) {
              $rootScope.$state.go(redirect, redirect_params);
            } else { $rootScope.$state.go('home'); }
          }
        },
        function(response){
          console.log("Error in authentication check ", response);
        });
      }
    }); // end of $rootScope.$on

  }]
);