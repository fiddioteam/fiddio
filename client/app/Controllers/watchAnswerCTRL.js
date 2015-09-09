angular.module('fiddio')
  .controller('WatchAnswer', ['answer', 'PlayerFactory', 'angularPlayer', '$rootScope', function(answer, PlayerFactory, angularPlayer, $rootScope) {
    var vm = this;
    var _changes;
    vm.song = {
      id: 'fiddio'+answer.id,
      url: '/uploads/'+answer.id+'.mp3'
    };

    vm.playRecording = function() {
      _changes = _changes || angular.fromJson(answer.code_changes);
      if (!angularPlayer.getCurrentTrack()) {
        angularPlayer.addTrack(vm.song);
        PlayerFactory.setRecording(_changes);
      }
      PlayerFactory.smashChanges();
      PlayerFactory.playActions();
      PlayerFactory.setReadOnly(true);
      angularPlayer.play();
    };

    vm.pauseRecording = function(){
      angularPlayer.pause();
      PlayerFactory.setReadOnly(false);
    };

    vm.playbackOptions = PlayerFactory.playbackOptions;
    PlayerFactory.setCode(answer.question.code);
  }]);