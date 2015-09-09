angular.module('fiddio')
  .controller('WatchAnswer', ['answer', 'PlayerFactory', function(answer, PlayerFactory) {
    var vm = this;
    vm.answer = answer;
    console.log('ANSHWERR', answer);

    vm.playRecording = function() {
      var responseData = {
        editorChanges: angular.fromJson(answer.code_changes),
        audioURL: '/uploads/'+answer.id+'.mp3'
      };
      PlayerFactory.startPlayback(responseData);
    };
    vm.playbackOptions = PlayerFactory.playbackOptions;
    PlayerFactory.setCode(vm.answer.question.code);
  }]);