$(function() 
{
 
	
	 $("#infoButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":"0.9", 
	  "position":"absolute", "top":"4px", "left":"4px"
	}) // adds CSS
    .append("<img width='32' height='32' src='images/icon-info.png'/>")
 
	.click( 
		function(){  
			gameEngine.computer.play();
		});
});
/*
new SpeechRouter({
    routes: {
        "use planet :id": function (id) {
            document.title = id;
        },
        "start music": function () {
            document.title = "start music";
        },
        "stop music": function () {
            document.title = "stop music";
        },
    }
}).start();

*/

window.gameEngine = new GameEngine(window);
$(function() {
	$topLoader = $("#topLoader");
	gameEngine.preload(function() {
		gameEngine.start();
		$("#ThreeJS").fadeIn("fast", function() {
			$topLoader.fadeOut("fast", function() {

				document.title = "";

				// intro
		 		gameEngine.sound.sample["system_alarm"].play();
				window.setTimeout(function  () {
				 	gameEngine.sound.sample["computer_work_beep"].play();
					gameEngine.alert({
						type: "fatal",
						seconds: 4,
						msg:"Commander!<br>We are on red alert!<br>All systems are ready.<br>We jump to the central command point now ..."
					}, function() {

					 	gameEngine.sound.sample["tng_warp4_clean"].play();
						//gameEngine.cam.move(gameEngine.planet(0), gameEngine.planet(0), gameEngine.planet(0), function(){
							gameEngine.sound.sample["computer_work_beep_simple"].play();

							gameEngine.cam.move({position:{x:3100,y:0,z:0},config:{size:10}}, gameEngine.planet(0), gameEngine.planet(0), function(){


								gameEngine.camera.lookAt(gameEngine.planet(0).position(gameEngine.timeMachine() * 0.025));
								gameEngine.sound.sample["computer_work_beep"].play();
								gameEngine.sound.music.play();
								gameEngine.alert({
									type: "info",
									seconds: 7,
									msg:"Foreign powers fall into our system ...<br>Show no mercy!<br>Defend the habitat of our civilization and destroy them!<br><br>Good luck... (press 'h' for help)"
								});
								window.setTimeout(function(){
								 	gameEngine.computer.interPlanetaryEvents.execute();
								}, 1000*0);
							});
						//});
					});
				},6000);
			});
		});
	}, function  (percentDone) {
		//document.title = percentDone + "%";
		 
		$topLoader.text("loading space... " + Math.round(percentDone,4) + "%"); 
	});
});
