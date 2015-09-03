angular.module('fiddio')
  .controller('QuestionView', ['question', function(question) {
    console.log('QV', question);
    var vm = this;
    vm.question = question;

  }]);