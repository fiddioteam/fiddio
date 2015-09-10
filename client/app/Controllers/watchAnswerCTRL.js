angular.module('fiddio')
  .controller('WatchAnswer', ['answer', 'PlayerFactory', 'angularPlayer', '$rootScope', '$scope', function(answer, PlayerFactory, angularPlayer, $rootScope, $scope) {
    var vm = this;
    var _changes;
    vm.answer = answer;
    vm.song = {
      id: 'fiddio'+answer.id,
      url: '/uploads/'+answer.id+'.mp3'
    };

    console.log("Answer in WatchAnswer: ", answer);

    $scope.$on('$destroy', function() {
      angularPlayer.stop();
      angularPlayer.setCurrentTrack(null);
      angularPlayer.clearPlaylist();
    });

    vm.isPlaying = false;

    vm.playRecording = function() {
      _changes = _changes || answer.code_changes;
      if (!angularPlayer.getCurrentTrack()) {
        angularPlayer.addTrack(vm.song);
        PlayerFactory.setRecording(_changes);
      }
      PlayerFactory.smashChanges();
      PlayerFactory.playActions();
      PlayerFactory.setReadOnly(true);
      angularPlayer.play();
      vm.isPlaying = true;
    };

    vm.pauseRecording = function(){
      angularPlayer.pause();
      PlayerFactory.setReadOnly(false);
      vm.isPlaying = false;
    };

    // vm.upVote = function() {

    // };

    // vm.downVote = function() {

    // };

    vm.playbackOptions = PlayerFactory.playbackOptions;
    PlayerFactory.setCode(answer.question.code);
  }]);