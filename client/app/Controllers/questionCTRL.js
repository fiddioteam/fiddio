angular.module('fiddio')
  .controller('QuestionController', [
    '$rootScope',
    'question',
    'Authentication',
    'QuestionDisplayFactory',
    'DataPackager',

    function($rootScope, question, Authentication, QuestionDisplayFactory, DataPackager) {

    var vm = this;
    console.log('Question data: ', question.data);

    vm.question = question.data;
    vm.displayOptions = QuestionDisplayFactory.displayOptions;
    QuestionDisplayFactory.setCode(vm.question.code);

    DataPackager.downloadResponses($rootScope.$stateParams.questionID)
    .success(function(data, status, headers, config){
      console.log('Responses', data);
    });


    vm.authenticateUser = function(type) {
      Authentication.resolveAuth(type, "answer", { questionID: $rootScope.$stateParams.questionID });
    };

  }]);