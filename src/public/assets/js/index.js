/* global window console _ */

console.log('init underscore (remove me)', _);

window.time = 100;

(function windowMess(window) {
  'use strict';

  // Vars
  var DEBUG = true
    , audioContext = new window.AudioContext()
    , MIN_SAMPLES = 0  // will be initialized when AudioContext is created.
    , analyser
    , buflen = 1024
    , buf = new Float32Array( buflen )
    , noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    , BASE_URL = window.location.protocol + '//' + window.location.host
    , FULL_URL = window.location.href
    , ROOM_URL_ID = Number(window.location.hash.replace('#', ''))
    , ROOM_URL = BASE_URL + '/room.html#' + ROOM_URL_ID
    , ROOM_ROUTE = 'room.html'
    , WS_URL = 'ws://localhost:9876'
    , userdataReadyEvent = new window.CustomEvent('userdata:ready')
    , section
    , log = function log() {

        if (DEBUG) {

          var fun = Function.prototype.bind.call(window.console.log, window.console);
          fun.apply(window.console, arguments);
        }
      }
    , isStudentOrTeacher = function isStudentOrTeacher() {

        window.sessionStorage.roomID = ROOM_URL_ID;
        if (ROOM_URL_ID === Number(window.sessionStorage.myRoomID)) {

          window.sessionStorage.userType = 'teacher';
        } else {

          window.sessionStorage.userType = 'student';
        }
      }
    , createRoom = function createRoom() {

        window.sessionStorage.myRoomID = Math.floor(Math.random() * 10000);
        window.location.href = BASE_URL + '/room.html#' + window.sessionStorage.myRoomID;
      }
    , isRoom = function isRoom() {

        if (FULL_URL.indexOf(ROOM_ROUTE) !== -1) {

          return true;
        }
      }
    , userdataIsReady = function userdataIsReady() {

        if (isRoom()) {

          window.dispatchEvent(userdataReadyEvent);
        }
      }
    , retrieveToken = function retrieveToken() {

        window.$.get('/token', function onResponse(token) {

          log('got token', token);
          window.sessionStorage.token = token;
          userdataIsReady();
        });
      }
    , noteFromPitch = function noteFromPitch( frequency ) {

        var noteNum = 12 * (Math.log(frequency / 440 ) / Math.log(2));
        return Math.round( noteNum ) + 69;
      }
    , drawNote = function drawNote(sectionNum, note) {

      //To check that doesn't exist #
      if (note.indexOf('#') === -1) {

        window.$('#Layer_1 rect').css('fill', '#FFFFFF');
        window.$('#Layer_2 rect').css('fill', '#000000');
        window.$('#Layer_1 #range' + sectionNum + ' #' + note).css('fill', '#FF0000');
      } else {

        note = note.replace(/[^a-zA-Z0-9]/g, '');
        window.$('#Layer_1 rect').css('fill', '#FFFFFF');
        window.$('#Layer_2 rect').css('fill', '#000000');
        window.$('#Layer_2 #range' + sectionNum + ' #' + note).css('fill', '#00FF00');
      }
    }
    , displayButton = function displayButton(pitch, note) {

        if (pitch !== '-') {

          pitch = Number(pitch).toFixed(3);
          //According to the Hz
          if (pitch >= 27.500 && pitch < 32.703) {

            //Group A0
            section = 0;
          }

          if (pitch >= 32.703 && pitch < 55.000) {

            //Group A1
            section = 1;
          }

          if (pitch >= 55.000 && pitch < 110.000) {

            //Group A2
            section = 2;
          }

          if (pitch >= 110.000 && pitch < 220.000) {

            //Group A3
            section = 3;
          }

          if (pitch >= 220.000 && pitch < 440.000) {

            //Group A4
            section = 4;
          }

          if (pitch >= 440.000 && pitch < 880.000) {

            //Group A5
            section = 5;
          }

          if (pitch >= 880.000 && pitch < 1760.000) {

            //Group A56
            section = 6;
          }

          if (pitch >= 1760.000 && pitch < 3520.000) {

            //Group A7
            section = 7;
          }

          drawNote(section, note);

          var usersMap = window.singnaler.dataChannels[window.sessionStorage.roomID]
            , users = Object.keys(usersMap)
            , usersIndex = 0
            , unsersLength = users.length
            , aUser;
          for (usersIndex; usersIndex < unsersLength; usersIndex += 1) {

            aUser = usersMap[users[usersIndex]];
            if (aUser) {

              aUser.send(window.JSON.stringify({
                'section': section,
                'note': note
              }));
            }
          }
        }
      }
    /* eslint-disable */
    , autoCorrelate = function autoCorrelate( buf, sampleRate ) {
        var SIZE = buf.length;
        var MAX_SAMPLES = Math.floor(SIZE/2);
        var best_offset = -1;
        var best_correlation = 0;
        var rms = 0;
        var foundGoodCorrelation = false;
        var correlations = new Array(MAX_SAMPLES);

        for (var i=0;i<SIZE;i++) {
          var val = buf[i];
          rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
          return -1;

        var lastCorrelation=1;
        for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
          var correlation = 0;

          for (var i=0; i<MAX_SAMPLES; i++) {
            correlation += Math.abs((buf[i])-(buf[i+offset]));
          }
          correlation = 1 - (correlation/MAX_SAMPLES);
          correlations[offset] = correlation; // store it, for the tweaking we need to do below.
          if ((correlation>0.9) && (correlation > lastCorrelation)) {
            foundGoodCorrelation = true;
            if (correlation > best_correlation) {
              best_correlation = correlation;
              best_offset = offset;
            }
          } else if (foundGoodCorrelation) {
            // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
            // Now we need to tweak the offset - by interpolating between the values to the left and right of the
            // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
            // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
            // (anti-aliased) offset.

            // we know best_offset >=1,
            // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
            // we can't drop into this clause until the following pass (else if).
            var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
            return sampleRate/(best_offset+(8*shift));
          }
          lastCorrelation = correlation;
        }
        if (best_correlation > 0.01) {
          // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
          return sampleRate/best_offset;
        }
        return -1;
        //  var best_frequency = sampleRate/best_offset;
      }
    /* eslint-enable */
    , updatePitch = function updatePitch() {
        var pitch
         , note
         , ac;
        analyser.getFloatTimeDomainData( buf );
        ac = autoCorrelate( buf, audioContext.sampleRate );
        if (ac === -1) {

          //Added
          displayButton('-', '-');
        } else {

          pitch = ac;
          note = noteFromPitch(pitch);
          displayButton(pitch, noteStrings[note % 12]);
        }

        if (!window.requestAnimationFrame) {

          window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        }
        window.requestAnimationFrame( updatePitch );
      };

  window.singnaler = window.singnaler(WS_URL);
  // Events
  window.addEventListener('stream:someone-arrived', function onSomeOneArrived() {

    window.$('#waitingPopup').fadeOut(0);
  });

  window.addEventListener('stream:data-arrived', function onDataArrived(event) {

    log('--> data arrived');
    if (event &&
      event.detail) {

        // event.detail
      var evt = JSON.parse(event.detail);

      window.console.log(evt);

      drawNote(evt.section, evt.note);

      // window.console.log(event.detail);
    } else {

      throw 'Event is empty';
    }
  });

  window.addEventListener('stream:arrive', function onStreamArrived(event) {

    log('---> start stream');
    if (event &&
      event.detail &&
      event.detail.mediaElement &&
      event.detail.userid) {

      var videoElement = window.$('#video').get(0);
      // media stream

      window.attachMediaStream(videoElement, event.detail.mediaElement);
      videoElement.id = event.detail.userid;
      videoElement.play();
      window.$('#waitingPopup').fadeOut(0);

      //register on
    } else {

      throw 'Event is empty';
    }
  });

  window.addEventListener('stream:my-stream', function onMyStream(event) {

    log('---> start stream');
    if (event &&
      event.detail) {

      var videoElement = window.$('#video').get(0)
        , mediaStreamSource;
      window.attachMediaStream(videoElement, event.detail);
      videoElement.id = 'me';
      videoElement.play();
      window.$('#waitingPopup').removeClass('hide');

      // Create an AudioNode from the stream.
      mediaStreamSource = audioContext.createMediaStreamSource(event.detail);
      //var mediaStreamSource = audioContext.createMediaElementSource(video);
      // Connect it to the destination.
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      mediaStreamSource.connect( analyser );
      updatePitch();
    } else {

      throw 'Event is empty';
    }
  });

  window.addEventListener('stream:end', function onEndStream(event) {

    log('---> end stream');
    if (event &&
      event.detail &&
      event.detail.userid) {

      var video = window.$('#' + event.detail.userid).get(0);
      video.src = '';
      video.id = 'video';
    } else {

      throw 'Event is empty';
    }
  });

  window.addEventListener('userdata:ready', function onUserDataReady() {

    log('User data is ready to RTC!');
    if (window.sessionStorage.userType &&
      window.sessionStorage.roomID &&
      window.sessionStorage.token) {

      var userType = window.sessionStorage.userType
        , roomId = window.sessionStorage.roomID
        , userId = window.sessionStorage.token;
      if (userType === 'teacher') {

        window.singnaler.createChannel(roomId, userId);
      } else if (userType === 'student') {

        window.singnaler.joinChannel(roomId, userId);
      } else {

        throw 'User type provided is invalid';
      }
    }
  }, false);

  // Main
  log('TeachRTC is initializing...');
  isStudentOrTeacher();
  if (!window.sessionStorage.token) {

    retrieveToken();
  } else {

    log('token is already there', window.sessionStorage.token);
    userdataIsReady();
  }

  // Binding
  window.$('#piano').load('piano.html');
  window.$('.url-share-holder').text(ROOM_URL);
  window.$('#closePopup').on('click', function onPopUpClosing() {

    window.$('#invitePopup').addClass('hide');
  });
  window.$('#sharer').on('click', function onClickSharer() {

    window.$('#invitePopup').removeClass('hide');
  });
  window.$('#createRoom').on('click', function onClick() {

    createRoom();
  });
}(window));
