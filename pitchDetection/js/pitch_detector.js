/*global navigator, AudioContext, Uint8Array*/
(function (exports) {
  var NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var audioContext = new AudioContext();

  function getUserMedia(dictionary, callback) {
    try {
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      navigator.getUserMedia(dictionary, callback, function (err) {
        console.log('Stream generation failed: ', err.message);
      });
    } catch (err) {
      console.log('getUserMedia throw exception: ', err.message);
    }
  }

  function requestAnimationFrame(callback) {
    window.requestAnimationFrame = window.requestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.webkitRequestAnimationFrame;
    return window.requestAnimationFrame(callback);
  }

  function noteFromPitch(pitch) {
    var noteNum = 12 * (Math.log( pitch / 440 ) / Math.log(2));
    return Math.round(noteNum) + 69;
  }

  function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function centsOffFromPitch(frequency, note) {
    return Math.floor( 1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
  }

  function autoCorrelate( buf, sampleRate ) {
    var MIN_SAMPLES = 4;        // corresponds to an 11kHz signal
    var MAX_SAMPLES = 1000; // corresponds to a 44Hz signal
    var SIZE = 1000;
    var best_offset = -1;
    var best_correlation = 0;
    var rms = 0;

    if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES)) {
      return -1;  // Not enough data
    }

    for (var i = 0; i < SIZE; i++) {
      var val = (buf[i] - 128) / 128;
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
      var correlation = 0;

      for (var i = 0; i < SIZE; i++) {
        correlation += Math.abs(((buf[i] - 128) / 128) -
          ((buf[i + offset] - 128) / 128));
      }
      correlation = 1 - (correlation / SIZE);
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    }
    if ((rms > 0.01) && (best_correlation > 0.01)) {
      // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
      return sampleRate/best_offset;
    }
    return -1;
  //        var best_frequency = sampleRate/best_offset;
  }

  function Detector() {
    this.pitch;
    this.note;
    this.noteString = '';
    this.detune = 0;
    this.analyser = null;
    this.buflen = 2048;
    this.buf = new Uint8Array(this.buflen);
    this.requestId = null;
    this.audioStream = null;
  }

  Detector.prototype.startLiveInput = function () {
    getUserMedia({audio: true}, this.gotStream.bind(this));
  };

  Detector.prototype.gotStream = function (stream) {
    // Create an AudioNode from the stream.
    this.audioStream = stream;
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to the destination.
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    mediaStreamSource.connect(this.analyser);
    this.updatePitch();
  };

  Detector.prototype.updatePitch = function () {
    var cycles = [];
    this.analyser.getByteTimeDomainData(this.buf);
    var ac = autoCorrelate(this.buf, audioContext.sampleRate);
    if (ac !== -1) {
      this.pitch = ac;
      this.note = noteFromPitch(ac);
      this.detune = centsOffFromPitch(ac, this.note);
      this.noteString = NOTE_STRINGS[this.note % 12];
    }
    requestAnimationFrame(this.updatePitch.bind(this));
  };

  exports.pitchDetector = new Detector();
})(this);
