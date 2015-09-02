importScripts('Mp3LameEncoder.js');

var encoder;

this.onmessage = function(e) {
  switch (e.data.command) {
    case 'init':
      init(e.data.sampleRate);
      break;
    case 'record':
      record(e.data.buffer);
      break;
    case 'exportAudio':
      exportAudio();
      break;
    case 'cancel':
      cancel();
      break;
  }
};

// The initilization default sample rate of the input audio at 44k
// and scaled it down to 22k output. Not sure why this is necessary but is
// needed for the sound to come out right.
// The channels is set to mono and listenning to channel 1 which is the left channel.
// There is some problem with stereo channel support.
function init(sampleRate) {
  encoder = new Mp3LameEncoder(sampleRate, 64, 1, 3);
}

function record(buffer) {
  encoder.encode(buffer);
}

// Similar to the original exportWAV, it grabs the mp3 data from Lame encoder
// object and build an mp3 blob with it.
// When done, it posts the audio blob message to the worker.
function exportAudio() {
  this.postMessage(encoder.finish());
}

// Close the Lame encoder object stream, empty out the data in buffer and
// reset the buffer length stored.
function cancel() {
  encoder.cancel();
  encoder = null;
}