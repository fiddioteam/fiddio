angular.module('fiddio')
  .controller('SubmitQuestion', ['SubmitMode', 'DataPackager', function(SubmitMode, DataPackager){
    var vm = this;
    vm.submitOptions = SubmitMode.submitOptions;

    vm.submitQuestion = function() {
      vm.question.code = SubmitMode.getCode();
      // call to DataPackager method
      DataPackager.uploadQuestion(vm.question);
      // trigger state change
    };

  }]);