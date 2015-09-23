angular.module('fiddio')

.controller('BrowseQuestions', [
  '$element',
  'questions',
  function($element, questions) {
    var vm = this;
    vm.questions = questions.data.questions;
}]);