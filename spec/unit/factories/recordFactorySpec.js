describe('Testing RecordMode factory', function() {
  // initialize necessary variables at the top of the suite
  var RecordMode, uiAce;

  beforeEach(function() {
    // load the module that the factory is registered with
    module('fiddio');
    // inject the factory to be tested before each spec
    inject(function($injector) {
      // uiAce = $injector.get('ui.ace');
      RecordMode = $injector.get('RecordMode');
    });
  });

  // it('should have a set of recording options', function() {
  //   var recordOptions = RecordMode.recordOptions;
  //   expect(recordOptions.theme).toBe('solarized_dark');
  // });
  
  

});