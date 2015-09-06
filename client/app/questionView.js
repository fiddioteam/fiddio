angular.module('fiddio')
  .controller('QuestionView', ['$rootScope', 'question', 'Authentication','DisplayMode', 'DataPackager', function($rootScope, question, Authentication,DisplayMode, DataPackager) {
    console.log('QV', question);
    var vm = this;
    console.log('QUESTION',question.data);
    console.log('Display mode?', DisplayMode);
    vm.question = question.data;
    vm.displayOptions = DisplayMode.displayOptions;
    DisplayMode.setCode(vm.question.code);

    DataPackager.downloadResponses($rootScope.$stateParams.questionID)
    .success(function(data, status, headers, config){
      console.log('Responses', data);
    });


    vm.authenticateUser = function(type) {
      Authentication.resolveAuth(type, "answer", { questionID: $rootScope.$stateParams.questionID });
    };

  }]);