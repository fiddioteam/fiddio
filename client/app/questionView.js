angular.module('fiddio')
  .controller('QuestionView', ['$rootScope', 'question', 'Authentication', function($rootScope, question, Authentication) {
    console.log('QV', question);
    var vm = this;
    console.log('QUESTION',question.data);
    vm.question = question.data;

    vm.authenticateUser = function(type) {
      Authentication.resolveAuth(type, "answer", { questionID: $rootScope.$stateParams.questionID });
    };

  }]);