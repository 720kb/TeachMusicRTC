var section;
var noteDetected;

var audioContext = null;
var meter = null;

$( document ).ready(function() {
   $("#piano").load("piano.html");
   
   $( "#activePitch").off("click").on( "click", function() {
	  activePitchDetection();
	});
	
	DEBUGCANVAS = document.getElementById( "waveform" );
	if (DEBUGCANVAS) {
		waveCanvas = DEBUGCANVAS.getContext("2d");
		waveCanvas.strokeStyle = "black";
		waveCanvas.lineWidth = 1;
	}
});


function flash(callback) {
        window.requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame;
        return window.requestAnimationFrame(callback);
}
      
function activePitchDetection() {
        pitchDetector.startLiveInput();
        setAudioControl();
        display()
};

function setAudioControl(){
		
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext();
}



function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    display();
}

function display() {
          if (pitchDetector.pitch) {
          	
          	// check if yhe volume is high enought
		    if (meter.checkClipping()){
		    	 displayPitch(pitchDetector.pitch , pitchDetector.noteString);
		    }
		   else{
		    	//console.log("volum not hight enought")
		    } 
          }
          flash(display);
};


function displayPitch(pitch, note) {

  		pitch=Number(pitch);

  		//According to the Hz
  		if(pitch>=27.500 && pitch<32.703){
  			//Group A0
  			section=0;
  		}
  		if(pitch>=32.703 && pitch<55.000){
  			//Group A1
  			section=1;
  		}
  		if(pitch>=55.000 && pitch<110.00){
  			//Group A2
  			section=2;
  		}

  		if(pitch>=110.00 && pitch<220.00){
  			//Group A3
  			section=3;
  		}

  		if(pitch>=220.00 && pitch<440.00){
  			//Group A4 // (LA)
  			section=4;
  		}

  		if(pitch>=440.00 && pitch<880.00){
  			//Group A5
  			section=5;
  		}

  		if(pitch>=880.00 && pitch<1760.0){
  			//Group A6
  			section=6;
  		}

  		if(pitch>=1760.0 && pitch<3520.0){
  			//Group A7
  			section=7;
  		}
  		

		$("#Layer_1 rect").css("fill","#FFFFFF");
		$("#Layer_2 rect").css("fill","#000000");
		   
  		if(note.indexOf("#")==-1){
           $("#Layer_1 #range"+section+" #"+note).css("fill","#FF0000");
		}
		else{
			note=note.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
			$("#Layer_2 #range"+section+" #"+note).css("fill","#00FF00");
		}
		
		
		
		
		
}


/*
var firstSectionValuesCollection=new Array();
var locked=false;
var timer;
var count=0;

function timerCleaner(){
	if(locked==false){
	   locked=true;
	   timer = setInterval(control, 10);
	}
}

function control(){
	if(count>10){
		 
		 $("#Layer_1 rect").css("fill","#FFFFFF");
		$("#Layer_2 rect").css("fill","#000000");
		$("#"+layer+" #range"+firstSectionValuesCollection[0]+" #"+noteDetected).css("fill","#00FF00");
		 
		 firstSectionValuesCollection=[];
		 clearInterval(timer);
		 locked=false;
		 count=0;
	}
	count++;
}
*/

/*
var layer;
var notesCollection=new Array();
var sectionsCollection=new Array();
var myTimer;
var blocked=false;
var counter=0;

function activateTimer(){
	if(blocked==false){
	   blocked=true;
	   myTimer = setInterval(controlValue, 1);
	}
}

var sectionResulted;
var noteResulted;

function controlValue(){
	if(counter>10){
		 sectionResulted=mostFrequent(sectionsCollection);
		 noteResulted=mostFrequent(notesCollection);
		 //console.log("layer "+layer +" - section: "+sectionResulted+ " - noteResulted "+noteResulted);
		 
		 $("#Layer_1 rect").css("fill","#FFFFFF");
		 $("#Layer_2 rect").css("fill","#000000");
		 $("#"+layer+" #range"+sectionResulted+" #"+noteResulted).css("fill","#00FF00");
		 
		 notesCollection=[];
		 sectionsCollection=[];
		 clearInterval(myTimer);
		 blocked=false;
		 counter=0;
	}
	else{
		
	}
	counter++;
}



function mostFrequent(arr) {
    var uniqs = {};

    for(var i = 0; i < arr.length; i++) {
        uniqs[arr[i]] = (uniqs[arr[i]] || 0) + 1;
    }

    var max = { val: arr[0], count: 1 };
    for(var u in uniqs) {
        if(max.count < uniqs[u]) { max = { val: u, count: uniqs[u] }; }
    }

    return max.val;
}*/

