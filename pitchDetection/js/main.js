


function flash(callback) {
  window.requestAnimationFrame = window.requestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.webkitRequestAnimationFrame;
  return window.requestAnimationFrame(callback);
}
window.onload = function () {
  pitchDetector.startLiveInput();
  function display() {
        // console.log("note", pitchDetector.note);
    if (pitchDetector.pitch && pitchDetector.note ) {

      // tick(pitch, note)()

      tick_throttle(pitchDetector.pitch,  pitchDetector.noteString)


                  // tick_throttle(pitchDetector.pitch,  pitchDetector.noteString)

      // document.getElementById('pitch').innerHTML = pitchDetector.pitch;
      // document.getElementById('note').innerHTML = pitchDetector.note;
      // document.getElementById('note-string').innerHTML = pitchDetector.noteString;
    } else {

              	  // $("#Layer_1 rect").css("fill","#FFFFFF");
                  // $("#Layer_2 rect").css("fill","#000000");
    }
    flash(display);
  };
  display();
};




var section;

$( document ).ready(function() {
   $("#piano").load("piano.html")
});


var renderView = function(note, section) {
	//To check that doesn't exist #
  // console.log("note", note, "section", section)

  if (section == 4) {



    if(note.indexOf("#")==-1){

      if (section) {

        $("#Layer_1 rect").css("fill","#FFFFFF");
        $("#Layer_2 rect").css("fill","#000000");
        $("#Layer_1 #range"+section+" #"+note).css("fill","#FF0000");

      }
    } else {
      console.log("note", note, "section", section)

    	note=note.replace(/[^a-zA-Z0-9]/g,'');

      if (section) {

    	  $("#Layer_1 rect").css("fill","#FFFFFF");
        $("#Layer_2 rect").css("fill","#000000");
        $("#Layer_2 #range"+section+" #"+note).css("fill","#00FF00");

      }
    }

  }
}

// var renderViewOld = function(note, section) {
// 	//To check that doesn't exist #
//   if(note.indexOf("#")==-1){
//
//     $("#Layer_1 rect").css("fill","#FFFFFF");
//     $("#Layer_2 rect").css("fill","#000000");
//     $("#Layer_1 #range"+section+" #"+note).css("fill","#FF0000");
//   }
//   else{
//
//   	  note=note.replace(/[^a-zA-Z0-9]/g,'');
//   	  $("#Layer_1 rect").css("fill","#FFFFFF");
//     $("#Layer_2 rect").css("fill","#000000");
//     $("#Layer_2 #range"+section+" #"+note).css("fill","#00FF00");
//   }
// }


var tick = function(pitch, note) {

  return function() {
    // console.log(pitch)


    if(pitch!=11025){

            // console.log(pitch)
                  // console.log(note)

  		pitch=Number(pitch).toFixed(3);

  		//According to the Hz
  		if(pitch>=27.500 && pitch<32.703){
  			//Group A0
  			section=0;
  		}
  		if(pitch>=32.703 && pitch<55.000){
  			//Group A1
  			section=1;
  		}
  		if(pitch>=55.000 && pitch<110.000){
  			//Group A2
  			section=2;
  		}

  		if(pitch>=110.000 && pitch<220.000){
  			//Group A3
  			section=3;
  		}

  		if(pitch>=220.000 && pitch<440.000){
  			//Group A4 // (LA)
  			section=4;
  		}

  		if(pitch>=440.000 && pitch<880.000){
  			//Group A5
  			section=5;
  		}

  		if(pitch>=880.000 && pitch<1760.000){
  			//Group A6
  			section=6;
  		}

  		if(pitch>=1760.000 && pitch<3520.000){
  			//Group A7
  			section=7;
  		}



      // console.log("note - section:", note, section)

      renderView(note, section)

  	} else {
  	  //  $("#Layer_1 rect").css("fill","#FFFFFF");
  	  //   $("#Layer_2 rect").css("fill","#000000");
    }
  }

}


// window.time = 100
// window.time = 120
window.time = 30

var tick_throttle = _.throttle(function(pitch, note){
  tick(pitch, note)()
}, window.time)



var displayButton = function(pitch, note){
  // _.debounce(tick(pitch, note), 200)

  // console.log("..")

  // var tick_throttle = _.debounce(function(){




  tick_throttle(pitch, note)

  // tick(pitch, note)()
}
