angular.module('fiddio')

.directive('avatar', [
  '$rootScope',
  '$timeout',
  function($rootScope, $timeout) {
    return {
      restrict: 'E',
      templateUrl: '/templates/avatar.html',
      replace: true,
      scope: {
        size: '@',
        avatarTextStyle: '@',
        displayName: '@'
      },
      link: function($scope, iElm, iAttrs, controller) {
        $scope.userData = $rootScope.userData;
        $scope.userInfo = $rootScope.userData.getItem('userInfo');
        $scope.$watch('userData', function() {
          // This will only get changed when authentication changes
          $timeout( function() {
            $scope.userInfo = $rootScope.userData.getItem('userInfo');
            var imgTag = iElm.find('img');
            iElm.find('img').attr('src', $scope.userInfo.profile_pic);
          });
        });
      }
    };
  }
]);