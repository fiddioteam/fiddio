angular.module('fiddio')
  .factory('AskFactory', [function() {

    var _aceEditor, _session, _document;

    var askOptions = {
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
      _aceEditor.$blockScrolling = Infinity;
      _aceEditor.setOption('showPrintMargin', false);
    }

    function getCode(){
      return _document.getAllLines().join('\n');
    }

    return {
      askOptions: askOptions,
      getCode: getCode
    };

  }]);
