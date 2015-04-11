var section;

$( document ).ready(function() {
   $("#piano").load("piano.html")
});

function displayButton(pitch, note){
	if(pitch!="-"){
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
			//Group A4
			section=4;
		}
		
		if(pitch>=440.000 && pitch<880.000){
			//Group A5
			section=5;
		}
		
		if(pitch>=880.000 && pitch<1760.000){
			//Group A56
			section=6;
		}
		
		if(pitch>=1760.000 && pitch<3520.000){
			//Group A7
			section=7;
		}

		//To check that doesn't exist #
		   if(note.indexOf("#")==-1){
		      
		      $("#Layer_1 rect").css("fill","#FFFFFF");
		      $("#Layer_2 rect").css("fill","#000000");
		      $("#Layer_1 #range"+section+" #"+note).css("fill","#FF0000");
		   }
		   else{
		   	
		   	  note=note.replace(/[^a-zA-Z0-9]/g,'');
		   	  $("#Layer_1 rect").css("fill","#FFFFFF");
		      $("#Layer_2 rect").css("fill","#000000");
		      $("#Layer_2 #range"+section+" #"+note).css("fill","#00FF00");
		   }

	}
	//$("#Layer_1 rect").css("fill","#FFFFFF");
	//$("#Layer_2 rect").css("fill","#000000");
}