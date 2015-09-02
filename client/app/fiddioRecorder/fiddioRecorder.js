angular.module('fiddio')

.factory('FiddioRecorder',[function(){

  // var WORKER_WAV_PATH = 'recorderWorker.js';
  var WORKER_MP3_PATH = 'app/fiddioRecorder/recorderWorkerMP3.js';

  return {
    recorder: function(stream){
      if (!window.AudioContext) { window.AudioContext = window.webkitAudioContext; }
      this.context = new window.AudioContext();
      this.source = this.context.createMediaStreamSource(stream);
      this.stream = stream;

      this.node = (this.context.createScriptProcessor ||
                  this.context.createJavaScriptNode)
                  .call(this.context, 4096, 1, 1);
      var worker = new Worker(WORKER_MP3_PATH);
      worker.postMessage({
        command: 'init',
        sampleRate: this.context.sampleRate
      });
      this.recording = false;
      var currCallback;

      this.node.onaudioprocess = function(e){
        if (!this.recording) return;

        console.log('DATA!!!!', e.inputBuffer.getChannelData(0));
        worker.postMessage({
          command: 'record',
          buffer: [
            e.inputBuffer.getChannelData(0)
            // e.inputBuffer.getChannelData(1)
          ]
        });
      }.bind(this);

      this.record = function(){
        this.recording = true;
      };

      this.pause = function() {
        this.recording = false;
      };

      this.stop = function(){
        this.recording = false;

        this.exportAudio(function(blob){
          console.log('WE GOTZ THE DATAS!');
          this.source.disconnect();
          this.node.disconnect();
        });
      };

      this.cancel = function(){
        worker.postMessage({ command: 'cancel' });
      };

      this.exportAudio = function(cb) {
        currCallback = cb;
        if (!currCallback) throw new Error('Callback not set');
        worker.postMessage({
          command: 'exportAudio'
        });
      };

      worker.onmessage = function(e) {
        var blob = e.data;
        console.log(blob);
        if (currCallback) { currCallback(blob); }
      };

      this.source.connect(this.node);
      this.node.connect(this.context.destination);    //this should not be necessary
    }
  };

}]);
