angular.module('fiddio')
  .factory('QuestionDisplayFactory', [function() {

    var _aceEditor, _session, _document, _code;

    var displayOptions = {
      useWrapMode: true,
      showGutter: true,
      theme: 'idle_fingers',
      mode: 'javascript',
      onLoad: aceLoaded,
    };

    function aceLoaded(_editor) {
      _aceEditor = _editor.env.editor;
      _session = _editor.getSession();
      _document = _session.getDocument();
      _aceEditor.setValue('', -1);
      _aceEditor.setReadOnly(true);
      _aceEditor.$blockScrolling = Infinity;
      _aceEditor.setOption('showPrintMargin', false);
      _document.insert({row: 0, column: 0}, _code);

    }
    function getCode(){
      return _document.getAllLines().join('\n');
    }
    function setCode(code){
      _code = code;
    }

    return {
      displayOptions: displayOptions,
      getCode: getCode,
      setCode: setCode
    };

  }]);
