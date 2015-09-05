angular.module('fiddio')
  .factory('DisplayMode', [function() {

    var _aceEditor, _session, _document;

    var submitOptions = {
      useWrapMode: true,
      showGutter: true,
      theme: 'solarized_dark',
      mode: 'javascript',
      onLoad: aceLoaded,
    };

    function aceLoaded(_editor) {
      console.log('Ace Loaded');
      _aceEditor = _editor.env.editor;
      _session = _editor.getSession();
      _document = _session.getDocument();
      _aceEditor.setValue('', -1);
      _aceEditor.setReadOnly(true);
      _aceEditor.$blockScrolling = Infinity;
      _aceEditor.setOption('showPrintMargin', false);
    }
    function getCode(){
      // console.log(_document.getValue());
      return _document.getAllLines().join('\n');
    }

    return {
      submitOptions: submitOptions,
      getCode: getCode
    };

  }]);
