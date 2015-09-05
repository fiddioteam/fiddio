angular.module('fiddio')
  .controller('QuestionView', ['$rootScope', 'question', 'Authentication','DisplayMode', function($rootScope, question, Authentication,DisplayMode) {
    console.log('QV', question);
    var vm = this;
    console.log('QUESTION',question.data);
    console.log('Display mode?', DisplayMode);
    vm.question = question.data;
    vm.displayOptions = DisplayMode.displayOptions;
    DisplayMode.setCode(vm.question.code);

    vm.authenticateUser = function(type) {
      Authentication.resolveAuth(type, "answer", { questionID: $rootScope.$stateParams.questionID });
    };

  }]);