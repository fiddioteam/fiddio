describe('tests RecordMode factory', function() {
  // initialize necessary variables at the top of the suite
  var RecordMode;

  beforeEach(function() {
    // load the module that the factory is registered with
    module('fiddio');
    // inject the factory to be tested before each spec
    inject(function($injector) {
      RecordMode = $injector.get('RecordMode');
    });

    spyOn(RecordMode, 'setEditorText');
  });
  
  it('should have a recordOptions object', function() {
    expect(RecordMode.recordOptions).toEqual(jasmine.any(Object));
  });

  it('should a recordOptions object with mode "javascript"', function() {
    expect(RecordMode.recordOptions.mode).toBe('javascript');
  });

  it('should call aceLoaded on load', function() {
    RecordMode.setEditorText();
    expect(RecordMode.setEditorText).toHaveBeenCalled();
  });

  describe('startRecording method', function() {
    var currentlyRecording = false;

    beforeEach(function() {
      spyOn(RecordMode, 'startRecording');
      RecordMode.startRecording(currentlyRecording);
    });

    it('should be called wih currentlyRecording as an argument', function() {
      expect(RecordMode.startRecording).toHaveBeenCalled();
    });


  });
  
  describe('getRecordingStatus method', function() {
    var recordingStatus;

    beforeEach(function() {
      spyOn(RecordMode, 'getRecordingStatus').and.callThrough();
      recordingStatus = RecordMode.getRecordingStatus();
    });

    it('should return the current value of currentlyRecording', function() {
      expect(RecordMode.getRecordingStatus).toHaveBeenCalled();
      expect(recordingStatus).toBe(false);
    });
  });

  describe('setRecordingStatus method', function() {
    var recordingStatus;

    beforeEach(function() {
      spyOn(RecordMode, 'setRecordingStatus').and.callThrough();
      RecordMode.setRecordingStatus(1)
      recordingStatus = RecordMode.getRecordingStatus();
    });

    it('should return the current value of currentlyRecording', function() {
      expect(recordingStatus).toBe(true);
    });
  });

  describe('uploadEditorChanges method', function() {
    var results;

    beforeEach(function() {
      spyOn(RecordMode, 'uploadEditorChanges').and.callThrough();
      results = RecordMode.uploadEditorChanges();
    });

    it('should return an results array', function() {
      expect(results).toEqual(jasmine.any(Array));
    });

  });

});