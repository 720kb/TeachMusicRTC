/* global window */

(function windowMess(window) {
  'use strict';

  // Vars
  var DEBUG = true
    , BASE_URL = window.location.protocol + '//' + window.location.host
    , FULL_URL = window.location.href
    , ROOM_URL_ID = Number(window.location.hash.replace('#', ''))
    , ROOM_URL = BASE_URL + '/room.html#' + ROOM_URL_ID
    , ROOM_ROUTE = 'room.html'
    , WS_URL = 'ws://localhost:9876'
    , userdataReadyEvent = new window.CustomEvent('userdata:ready')
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
      };

  window.singnaler = window.singnaler(WS_URL);
  // Events
  window.addEventListener('stream:someone-arrived', function onSomeOneArrived() {

    window.$('#waitingPopup').fadeOut(0);
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


      // audio context

      // TODO

      // var context = new AudioContext();
      // var source = context.createMediaElementSource(video);
      //
      // var analyser = context.createAnalyser();
      // analyser.fftSize = 2048;
      // mediaStreamSource.connect( analyser );
      // updatePitch();


    } else {

      throw 'Event is empty';
    }
  });

  window.addEventListener('stream:my-stream', function onMyStream(event) {

    log('---> start stream');
    if (event &&
      event.detail) {

      var videoElement = window.$('#video').get(0);
      window.attachMediaStream(videoElement, event.detail);
      videoElement.id = 'me';
      videoElement.play();
      window.$('#waitingPopup').removeClass('hide');
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



  // UPDATE PITCH

  // pass audioContext (context)
  // create wavecanvas -> rename note antani ()


  // TODO - uncomment
  //
  // function updatePitch( time ) {
  //   var cycles = new Array;
  //   analyser.getFloatTimeDomainData( buf );
  //   var ac = autoCorrelate( buf, audioContext.sampleRate );
  //
  //   // TODO: Paint confidence meter on canvasElem here.
  //
  //   // if (DEBUGCANVAS) {  // This draws the current waveform, useful for debugging
  //   //   waveCanvas.clearRect(0,0,512,256);
  //   //   waveCanvas.strokeStyle = "red";
  //   //   waveCanvas.beginPath();
  //   //   waveCanvas.moveTo(0,0);
  //   //   waveCanvas.lineTo(0,256);
  //   //   waveCanvas.moveTo(128,0);
  //   //   waveCanvas.lineTo(128,256);
  //   //   waveCanvas.moveTo(256,0);
  //   //   waveCanvas.lineTo(256,256);
  //   //   waveCanvas.moveTo(384,0);
  //   //   waveCanvas.lineTo(384,256);
  //   //   waveCanvas.moveTo(512,0);
  //   //   waveCanvas.lineTo(512,256);
  //   //   waveCanvas.stroke();
  //   //   waveCanvas.strokeStyle = "black";
  //   //   waveCanvas.beginPath();
  //   //   waveCanvas.moveTo(0,buf[0]);
  //   //   for (var i=1;i<512;i++) {
  //   //     waveCanvas.lineTo(i,128+(buf[i]*128));
  //   //   }
  //   //   waveCanvas.stroke();
  //   // }
  //
  //    if (ac == -1) {
  //      detectorElem.className = "vague";
  //      pitchElem.innerText = "--";
  //     noteElem.innerText = "-";
  //     detuneElem.className = "";
  //     detuneAmount.innerText = "--";
  //    } else {
  //      detectorElem.className = "confident";
  //      pitch = ac;
  //      pitchElem.innerText = Math.round( pitch ) ;
  //      var note =  noteFromPitch( pitch );
  //     noteElem.innerHTML = noteStrings[note%12];
  //     var detune = centsOffFromPitch( pitch, note );
  //     if (detune == 0 ) {
  //       detuneElem.className = "";
  //       detuneAmount.innerHTML = "--";
  //     } else {
  //       if (detune < 0)
  //         detuneElem.className = "flat";
  //       else
  //         detuneElem.className = "sharp";
  //       detuneAmount.innerHTML = Math.abs( detune );
  //     }
  //   }
  //
  //   if (!window.requestAnimationFrame)
  //     window.requestAnimationFrame = window.webkitRequestAnimationFrame;
  //   rafID = window.requestAnimationFrame( updatePitch );
  // }


  // Binding

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
