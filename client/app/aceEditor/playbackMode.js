angular.module('fiddio')

.factory('PlaybackMode', [ '$http', function($http) {

  var _session, _document, _selection;

  var _recording = [];

  var playbackOptions = {
    useWrapMode: true,
    showGutter: true,
    theme: 'solarized_dark',
    mode: 'javascript',
    onLoad: aceLoaded,
    onChange: function(){}
  };
  function aceLoaded(){
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;

    
  }
  function play(){
    // start/sync mp3 and start Editor action loop
  }
  function pause(){
    // pause mp3 and Editor action loop
  }
  function reset(){
    // restart mp3 and start Editor action loop
  }
  function downloadEditorActions(){

  }
  function queueEditorAction(){
    // unshift obj from queue
    // if textObj, decide if insert or delete, then act accordingly
    // if cursorObj, move cursor and update text selection
  }
  function insertText(textObj){
    // parse text object and add lines onto editor
  }
  function removeText(textObj){
    // parse text object and remove lines from editor
  }
  function highlightText(cursorObj){
    // parse cursor object and update text selection
  }
  function moveCursor(cursorObj){
    // parse cursor object and move cursor to indicated area
  }
  function leaveComment(){
    // make sure player is paused and leave text at video timestamp
  }


  return {
    playbackOptions: playbackOptions
  }
}]);