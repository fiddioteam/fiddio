angular.module('fiddio')
  .controller('QuestionView', ['question', function(question) {
    var vm = this;
    vm.question = question;

  }]);