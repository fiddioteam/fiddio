angular.module('fiddio')
  .controller('BrowseQuestions', [ 'questions', function(questions){
    var vm = this;
    console.log('QUESTIONS!', questions);
    vm.questions = questions.data.questions;

  }]);