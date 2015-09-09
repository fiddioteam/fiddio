angular.module('fiddio')
  .controller('WatchAnswer', ['answer', 'PlayerFactory', function(answer, PlayerFactory) {
    var vm = this;
    vm.answer = answer;
    console.log('ANSHWERR', answer);

    vm.playRecording = PlayerFactory.startPlayback;
    vm.playbackOptions = PlayerFactory.playbackOptions;
    PlayerFactory.setCode(vm.answer.code);
  }]);