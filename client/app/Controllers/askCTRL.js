angular.module('fiddio')
  .controller('AskQuestion', ['AskFactory', 'DataPackager', '$state', function(AskFactory, DataPackager, $state){
    var vm = this;
    vm.askOptions = AskFactory.askOptions;

    vm.submitQuestion = function() {
      vm.question.code = AskFactory.getCode();
      // call to DataPackager method
      DataPackager.uploadQuestion(vm.question)
      .success(function(data, status, headers, config){
        $state.go('site.question',{ questionID: data.id });
        console.log("DOES IT WORK????",data.id);
      });
      // trigger state change
    };

  }]);