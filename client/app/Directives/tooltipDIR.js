angular.module('fiddio')
  .directive('tooltip', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        $(element).tooltip();
        $(element).on('blur', function(){
          $(element).tooltip('hide');
        });
      }
    };
  });