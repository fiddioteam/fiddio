angular.module('fiddio')
  .controller('AskQuestion', ['AskFactory', 'DataPackager', function(AskFactory, DataPackager){
    var vm = this;
    vm.askOptions = AskFactory.askOptions;

    vm.submitQuestion = function() {
      vm.question.code = AskFactory.getCode();
      // call to DataPackager method
      DataPackager.uploadQuestion(vm.question);
      // trigger state change
    };

  }]);