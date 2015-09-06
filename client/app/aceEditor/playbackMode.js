angular.module('fiddio')

.factory('PlaybackMode', [ '$window', 'DataPackager','$rootScope', function($window, DataPackager,$rootScope) {

  var _aceEditor, _session, _document, _selection, _playbackContext, _player, _responseData;

  var _recording = [];

  var editorActions = [
    insertText,
    removeText,
    moveCursor
  ]; // list of possible actions on moment objects

  var playbackOptions = {
    useWrapMode: true,
    showGutter: true,
    theme: 'solarized_dark',
    mode: 'javascript',
    onLoad: aceLoaded
  };
  function aceLoaded(_editor){
    window.aceEd = _editor.env.editor;
    _aceEditor = _editor.env.editor;
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    _aceEditor.setValue('',-1);
    _aceEditor.$blockScrolling = Infinity;
    _aceEditor.setOption("showPrintMargin", false);
  }

  function startPlayback(){
    _responseData = DataPackager.downloadResponseData(); // we need to parse this
    if (!window.AudioContext) { window.AudioContext = window.webkitAudioContext; }
    _playbackContext = new AudioContext();
    _player = new Audio();
    _player.src = $window.URL.createObjectURL(_responseData.mp3Blob);
    _playbackContext
      .createMediaElementSource(_player)
      .connect(_playbackContext.destination);
    _player.play();
    playActions(_responseData.editorChanges, _playbackContext);
  }

  function playActions(recording,context){
    var timeOutSpeed = 5;
    if (!recording.length){return;}
    setTimeout(function(){
      var time = context.currentTime * 1000|0;
      if ( recording[0][1] <= time) {
        var timeSlice = recording.shift();
        editorActions[timeSlice[0]](timeSlice);
      }
      playActions(recording, context);
    },timeOutSpeed);
  }
  function pause(){
    // pause mp3 and Editor action loop
  }
  function reset(){
    // restart mp3 and start Editor action loop
  }

  function insertText(textObj){
    _document.insert({
      row: textObj[2],
      column: textObj[3]
    }, textObj[6].join('\n'));
  }

  function removeText(textObj){
    _document.remove({
      start: {
        row: textObj[2],
        column: textObj[3]
      }, end: {
        row: textObj[4],
        column: textObj[5]
      }
    });
  }

  function moveCursor(cursorObj){
    _selection.setSelectionRange({
      start: {
        row: cursorObj[4],
        column: cursorObj[5]
      }, end: {
        row: cursorObj[6],
        column: cursorObj[7]
      }
    }, cursorObj[3] === cursorObj[5]);
    _selection.moveCursorToPosition({
      row: cursorObj[2],
      column: cursorObj[3]
    });
  }

  function leaveComment(){
    // make sure player is paused and leave text at video timestamp
  }


  return {
    startPlayback: startPlayback,
    playbackOptions: playbackOptions,
    playActions: playActions
  };
}]);