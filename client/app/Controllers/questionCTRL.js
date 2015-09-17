angular.module('fiddio')
.controller('QuestionController', [
  '$rootScope',
  'question',
  'Authentication',
  'QuestionDisplayFactory',
  'DataPackager',

  function($rootScope, question, Authentication, QuestionDisplayFactory, DataPackager) {
    var vm = this;

    vm.question = question.data;
    vm.displayOptions = QuestionDisplayFactory.displayOptions;
    QuestionDisplayFactory.setCode(vm.question.code);

    vm.answerQuestion = function() {
      $rootScope.$state.go('answer',{ questionID: $rootScope.$stateParams.questionID });
    };
}]);