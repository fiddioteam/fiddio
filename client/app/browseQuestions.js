angular.module('fiddio')
  .controller('BrowseQuestions', [ 'questions', function(questions){
    var vm = this;
    console.log('Questions is ', questions);

    vm.questions = questions;
    
  }]);