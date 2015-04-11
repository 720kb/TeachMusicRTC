var totKeys=52;
var totAttached=0;
var kind=0;
var total=0;
var whiteKeyPressed;

var totalLetters=7;
var widthKey=20;

$( document ).ready(function() {
    createPiano();
});

function createPiano(){
	while(totAttached<totKeys){
		
		if(kind==0){
			$("#piano #whiteKeys").append('<img id="'+total+'" class="threeKeys keys" src="img/whiteThreeKeys.svg" />');
			$("#piano #blackKeys").append('<img id="'+total+'" class="threeKeys keys" src="img/blackThreeKeys.svg" />');
			kind=1;
			totAttached+=3;
		}
		else{
			$("#piano #whiteKeys").append('<img id="'+total+'" class="fourKeys keys" src="img/whiteFourKeys.svg" />');
			$("#piano #blackKeys").append('<img id="'+total+'" class="fourKeys keys" src="img/blackFourKeys.svg" />');
			kind=0;
			totAttached+=4;
		}
		total++;
	}
	$("#piano").css("width",$("#piano #whiteKeys").width());
}

var section;
var lettar;

var startingPoint=100; //Letter First letter A keyboard
function displayButton(pitch, note){
	console.log("pitch: "+pitch+" - note: "+note);
	if(pitch!="-"){
		pitch=Number(pitch).toFixed(3);
		
		//According to the Hz
		if(pitch>=27.500 && pitch<55.000){
			//Group A0
			section=0;
		}
		if(pitch>=55.000 && pitch<110.000){
			//Group A1
			section=1;
		}
		
		if(pitch>=110.000 && pitch<220.000){
			//Group A2
			section=2;
		}
		
		if(pitch>=220.000 && pitch<440.000){
			//Group A3
			section=3;
		}
		
		if(pitch>=440.000 && pitch<880.000){
			//Group A4
			section=4;
		}
		
		if(pitch>=880.000 && pitch<1760.000){
			//Group A5
			section=5;
		}
		
		if(pitch>=1760.000 && pitch<3520.000){
			//Group A6
			section=6;
		}
		
		
		
		//To check that doesn't exist #
		   if(note.indexOf("#")==-1){
		      switch (note){
		      	case "A":
		      	lettar=0;
		      	break;
		      	case "B":
		      	lettar=1;
		      	break;
		      	case "C":
		      	lettar=2;
		      	break;
		      	case "D":
		      	lettar=3;
		      	break;
		      	case "E":
		      	lettar=4;
		      	case "F":
		      	lettar=5;
		      	case "G":
		      	lettar=6;
		      	break;
		      	default:
		      	console.log("not present");
		      	break;
		      }
		      
		      $("#piano #whiteKeyPressed").css("left",(startingPoint+widthKey*(section*totalLetters)+(widthKey*lettar)) ); 
		   }
		   else{
		   	 $("#piano #whiteKeyPressed").css("left",-20 ); 
		   }
	   
	   
	}
}

/*

function displayNotes(pitch, note){
	//console.log("pitch: "+pitch+" - note: "+note);
	whiteKeyPressed=null;
	if(pitch!="-"){
	pitch=Number(pitch).toFixed(3);
	switch(pitch){
		case 27.500:
		  whiteKeyPressed=1;
		break;
		case 30.868:
		  whiteKeyPressed=2;
		break;
		case 32.703:
		  whiteKeyPressed=3;
		break;
		case 36.708:
		  whiteKeyPressed=4;
		break;
		case 41.203:
		  whiteKeyPressed=5;
		break;
		case 43.654:
		  whiteKeyPressed=6;
		break;
		case 48.999:
		  whiteKeyPressed=7;
		break;
		case 55.000:
		  whiteKeyPressed=8;
		break;
		case 61.735:
		  whiteKeyPressed=9;
		break;
		case 65.406:
		  whiteKeyPressed=10;
		break;
		case 73.416:
		  whiteKeyPressed=12;
		break;
		case 82.407:
		  whiteKeyPressed=13;
		break;
		case 803.307:
		  whiteKeyPressed=14;
		break;
		case 97.999:
		  whiteKeyPressed=15;
		break;
		case 110.000:
		  whiteKeyPressed=16;
		break;
		case 123.470:
		  whiteKeyPressed=17;
		break;
		case 130.810:
		  whiteKeyPressed=18;
		break;
		case 146.830:
		  whiteKeyPressed=19;
		break;
		case 164.810:
		  whiteKeyPressed=20;
		break;
		
		case 174.610:
		  whiteKeyPressed=21;
		break;
		case 196.000:
		  whiteKeyPressed=22;
		break;
		case 220.000:
		  whiteKeyPressed=23;
		break;
		case 246.940:
		  whiteKeyPressed=24;
		break;
		case 261.630:
		  whiteKeyPressed=25;
		break;
		case 293.670:
		  whiteKeyPressed=26;
		break;
		case 329.630:
		  whiteKeyPressed=27;
		break;
		case 349.230:
		  whiteKeyPressed=28;
		break;
		case 392.000:
		  whiteKeyPressed=29;
		break;
		case 440.000:
		  whiteKeyPressed=30;
		break;
		case 493.880:
		  whiteKeyPressed=31;
		break;
		case 523.250:
		  whiteKeyPressed=32;
		break;
		case 587.330:
		  whiteKeyPressed=33;
		break;
		case 659.260:
		  whiteKeyPressed=34;
		break;
		case 698.460:
		  whiteKeyPressed=35;
		break;
		case 783.990:
		  whiteKeyPressed=36;
		break;
		case 880.000:
		  whiteKeyPressed=37;
		break;
		case 987.770:
		  whiteKeyPressed=38;
		break;
		case 1046.500:
		  whiteKeyPressed=39;
		break;
		case 1174.700:
		  whiteKeyPressed=40;
		break;
		
		case 1318.500:
		  whiteKeyPressed=41;
		break;
		case 1396.900:
		  whiteKeyPressed=42;
		break;
		case 1568.000:
		  whiteKeyPressed=43;
		break;
		case 1760.000:
		  whiteKeyPressed=44;
		break;
		case 1975.500:
		  whiteKeyPressed=45;
		break;
		case 2093.000:
		  whiteKeyPressed=46;
		break;
		case 2349.300:
		  whiteKeyPressed=47;
		break;
		case 2637.000:
		  whiteKeyPressed=48;
		break;
		case 2793.000:
		  whiteKeyPressed=49;
		break;
		case 3136.000:
		  whiteKeyPressed=50;
		break;
		
		case 3520.000:
		  whiteKeyPressed=51;
		break;
		case 3951.100:
		  whiteKeyPressed=52;
		break;
		case 4186.000:
		  whiteKeyPressed=53;
		break;
		
		default:
		  console.log("not identified: "+pitch);
		break;
	 }
	 $("#piano #whiteKeyPressed").css("left",widthKey*whiteKeyPressed); 		
	}
	
}*/
