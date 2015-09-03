angular.module('fiddio')

.factory('RecordMode', [ '$q','FiddioRecorder','DataPackager', function($q, FiddioRecorder, DataPackager) {

  var _aceEditor, _session, _document, _selection, _recorder, _audioBlob, _blobLength;
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
    _recorder = new FiddioRecorder.recorder(stream);
    _recorder.record();
    _aceEditor.setReadOnly(false);
  }

  function aceLoaded(_editor) {
    _aceEditor = _editor.env.editor;
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    _aceEditor.setValue('',-1);
    _aceEditor.$blockScrolling = Infinity;
    _aceEditor.setOption("showPrintMargin", false);
    _aceEditor.setReadOnly(true);
    _session.on('change', updateText);
    _selection.on('changeCursor', updateCursor);
  }

  function setEditorText(lines){
    _aceEditor.setValue('',-1);
    if (lines){
      _document.insert({
        row: 0,
        column: 0
      }, lines.join('\n'));
    }
  }

  function updateText(event) {
    var action;
    if (!currentlyRecording) { return; }
    if (event.action === 'insert')
      { action = 0; } else { action = 1; }
    _recording.push([
      action, // '0 for insert'  or '1 for remove'
      _recorder.context.currentTime*1000 | 0,
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
      _recorder.context.currentTime*1000 | 0,
      cursorPos.row,
      cursorPos.column,
      range.start.row,
      range.start.column,
      range.end.row,
      range.end.column
    ]);
  }


  function startRecording(currentlyRecording){
    return $q(function(resolve,reject){
      navigator.getUserMedia({audio:true}, resolve, reject);
    }).then(success);
  }

  function stopRecording(currentlyRecording){
    return $q(function(resolve,reject){
      if (!currentlyRecording) { return; }
      _aceEditor.setReadOnly(true);
      _recorder.stop(function(blob){
        _audioBlob = blob;
        _blobLength = _recorder.context.currentTime*1000 | 0;
        resolve();
      });
    });
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
    if (_recording.length > 0){
      DataPackager.uploadResponse(_recording, _audioBlob, _blobLength);
    }
    _recording = [];
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
