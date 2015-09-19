angular.module('fiddio')
  .controller('BrowseQuestions', [ '$element', 'questions', function($element, questions){
    var vm = this;
    console.log($('[data-toggle="tooltip"]').tooltip());
    vm.toolTip = function(){
      $('[data-toggle="tooltip"]').tooltip();
    };
    vm.questions = questions.data.questions;

  }]);