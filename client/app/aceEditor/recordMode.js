angular.module('fiddio')

.factory('RecordMode', [ '$q','FiddioRecorder','DataPackager', function($q, FiddioRecorder, DataPackager) {

  var _aceEditor, _session, _document, _selection, recorder;
  var _recording = [];
  var currentlyRecording = false;
  var recordOptions = {
    useWrapMode: true,
    showGutter: true,
    theme: 'solarized_dark',
    mode: 'javascript',
    onLoad: aceLoaded,
  };

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  function success(stream){
    recorder = new FiddioRecorder.recorder(stream);
    recorder.record();
    _aceEditor.setReadOnly(false);
    return true;
  }

  function aceLoaded(_editor) {
    _aceEditor = _editor.env.editor;
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    _aceEditor.setValue('',-1);
    _aceEditor.$blockScrolling = Infinity;
    _aceEditor.setReadOnly(true);
    _session.on('change', updateText);
    _selection.on('changeCursor', updateCursor);
  }

  function setEditorText(lines){
    // clear everything
    _aceEditor.setValue('',-1);
    // insert lines.join('\n')
  }

  function updateText(event) {
    var action;
    if (!currentlyRecording) { return; }
    if (event.action === 'insert')
      { action = 0; } else { action = 1; }
    _recording.push([
      action, // '0 for insert'  or '1 for remove'
      recorder.context.currentTime*1000 | 0,
      event.start.row,
      event.start.column,
      event.end.row,
      event.end.column,
      event.lines
    ]);
  }

  function updateCursor(event){
    if (!currentlyRecording) { return; }
    var cursorPos = _selection.getCursor();
    var range = _selection.getRange();
    _recording.push([
      2, // "2 for cursor"
      recorder.context.currentTime*1000 | 0,
      cursorPos.row,
      cursorPos.column,
      range.start.row,
      range.start.column,
      range.end.row,
      range.end.column
    ]);
  }


  function startRecording(currentlyRecording){
    return $q(function(resolve,reject){ // put all of this promise stuff into startRecording()
      navigator.getUserMedia({audio:true}, resolve, reject);
    }).then(success);
  }

  function stopRecording(currentlyRecording){
    if (!currentlyRecording) { return; }
    _aceEditor.setReadOnly(true);
    recorder.stop();
  }

  function setRecordingStatus(value){
    currentlyRecording = !!value;
  }

  function getRecordingStatus(){
    return currentlyRecording;
  }

  function uploadEditorChanges(currentlyRecording){
    if (currentlyRecording) { return; }
    console.log('Uploading '+_recording.length+' changes to db');
    console.log(JSON.stringify(_recording).length);
    console.log(_recording);
    // upload array to db
    var result = _recording;
    _recording = []; // clear array
    return result;
  }

  return {
    success: success,
    recordOptions: recordOptions,
    setEditorText: setEditorText,
    startRecording: startRecording,
    stopRecording: stopRecording,
    getRecordingStatus: getRecordingStatus,
    setRecordingStatus: setRecordingStatus,
    uploadEditorChanges: uploadEditorChanges
  };
}]);
