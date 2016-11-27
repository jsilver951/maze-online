// 37 Left
// 39 Right
// 38 Up
// 40 Down
// 32 Space // not defined
// 9 Tab
// 77 M // not defined

$(document).foundation();

// DEFAULT SETTINGS
var rows = 11;
var columns = 11;
var cellOffset = columns - 1;
var cellWidth = 200;
var cellHeight = 200;
var transformLeft = parseInt($('.grid').css('transform').split(',')[4]);
var transformTop = parseInt($('.grid').css('transform').split(',')[5]);

var originalLeft = parseInt($('.grid').css('transform').split(',')[4]);
var originalTop = parseInt($('.grid').css('transform').split(',')[5]);

var energy = 100;
var stick = 0;
var max_stick = 10;
var flint = 0;
var max_flint = 10;

var weapon = 0
var tool = 0
var shelter = 0
var fire = 0


var lava_messages = Array(
	"Really? The lava?!",
	"Lava is always bad.",
	"Why did you think that was a good idea?",
	"In what game is lava ever good?"
	);
var random_lava_message = lava_messages[Math.random()*lava_messages.length>>0]


// STARTING POSITIONS
$('.start').prev('.cell').removeClass('unseen');
$('.start').next('.cell').removeClass('unseen');
$('.start').nextAll('.cell').eq(cellOffset).removeClass('unseen');
$('.start').prevAll('.cell').eq(cellOffset).removeClass('unseen');

// SETUP
function _unseen() {
	$('.cell').addClass('unseen');
	$('.occupied').removeClass('unseen active seen');
	$('.occupied').prev('.cell').removeClass('unseen');
	$('.occupied').next('.cell').removeClass('unseen');
	$('.occupied').nextAll('.cell').eq(cellOffset).removeClass('unseen');
	$('.occupied').prevAll('.cell').eq(cellOffset).removeClass('unseen');
	$('.active').addClass('seen').removeClass('active');
}

// DIRECTIONAL
function _moveLeft() {	
	if(!$('.occupied').hasClass('left')){
		$('.occupied').addClass('active').removeClass('occupied');
		$('.active').prev('.cell').addClass('occupied');
		_unseen();
		transformLeft = transformLeft + cellWidth;
		$('.grid').css('transform', 'translate('+transformLeft+'px, '+transformTop+'px)');
	}
}

function _moveRight() {
	if(!$('.occupied').hasClass('right')){
		$('.occupied').addClass('active').removeClass('occupied');
		$('.active').next('.cell').addClass('occupied');	
		_unseen();
		transformLeft = transformLeft - cellWidth;
		$('.grid').css('transform', 'translate('+transformLeft+'px, '+transformTop+'px)');
	}
}

function _moveUp() {
	if(!$('.occupied').hasClass('top')){
		$('.occupied').addClass('active').removeClass('occupied');
		$('.active').prevAll('.cell').eq(cellOffset).addClass('occupied');
		_unseen();
		transformTop = transformTop + cellWidth;
		$('.grid').css('transform', 'translate('+transformLeft+'px, '+transformTop+'px)');
	}
}

function _moveDown() {
	if(!$('.occupied').hasClass('bottom')){
		$('.occupied').addClass('active').removeClass('occupied');
		$('.active').nextAll('.cell').eq(cellOffset).addClass('occupied');
		_unseen();
		transformTop = transformTop - cellWidth;
		$('.grid').css('transform', 'translate('+transformLeft+'px, '+transformTop+'px)');
	}
}

// ZOOM OUT "MAP"
function _pressTab() {
	$('.grid-wrapper').toggleClass('zoomOut');
}

// "STEPPED ON" FUNCTIONS
var water_timer = 250;
function _steppedOnWater() {
	if (energy > 0){
		// IDEA -- ADD TEMPERATURE TO ADJUST THE RATE HEALTH DECAYS IN WATER
		// if (temperature == "icy"){
		// 	water_timer = 100;	
		// } else {
		// 	water_timer = 500;
		// }
		setTimeout(function(){
			energy--;
			$('.hud .energy > span').text(energy);
			_journal(" Water is bad");
			if ($('.occupied').hasClass('water')){  		
				_steppedOnWater();
			} else {
				water_timer = 250;
				return;
			}
		}, water_timer);
	} else {
		_journal("Dude, get out of the fucking water.");
	}
}

var stick_timer = 0;
function _steppedOnStick() {
	if (stick < max_stick){
		setTimeout(function(){
			if ($('.occupied').hasClass('stick')){
				stick++;
				$('.hud .stick > span').text(stick);
				// ADD BREADCRUMB THAT ELEMENT WAS ADDED TO INVENTORY
				// $('.occupied:before').css('transform', 'translateX(-50%) rotate(360deg)');				
				stick_timer++;
				_journal("It took you "+ stick_timer +" seconds to collect 1 stick from here.");
				_steppedOnStick();
			} else {
				stick_timer = 0;
				return;
			}
		}, stick_timer*1000);
	} else {
		_journal("You cannot carry anymore stick.")
	}
}

var flint_timer = 0;
function _steppedOnFlint() {
	if (flint < max_flint){
		setTimeout(function(){
			if ($('.occupied').hasClass('flint')){
				flint++;
				$('.hud .flint > span').text(flint);
				_journal("It took you "+ flint_timer +" seconds to collect 1 flint from here.");
				flint_timer++;
				_steppedOnFlint();
			} else {
				flint_timer = 0;
				return;
			}
		}, flint_timer*1000);
	} else {		
		_journal("You cannot carry anymore flint.")
	}
}

function _steppedOnLava() {
	energy = 0;
	$('.hud .energy > span').text(energy);
	_journal(random_lava_message)
}


function _journal(message) {
	$('.console .content').append("<span>" + message + "</span>");
	$('.console .content').scrollTop($('.console .content')[0].scrollHeight);
}

$('.weapon').on('click', function (){
	if (stick >= 1 && flint >= 2){		
		stick = stick - 1;
		flint = flint - 2;
		weapon++;
		$('.hud .stick > span').text(stick);
		$('.hud .flint > span').text(flint);
		$('.hud .weapon > span').text(weapon);
		_journal("You made a spear. How did you know how to do that?");
	} else {
		_journal("You don't have enough stuff to do build anything.");
	}
});

$('.tool').on('click', function (){
	if (stick >= 2 && flint >= 1){		
		stick = stick - 2;
		flint = flint - 1;
		tool++;
		$('.hud .stick > span').text(stick);
		$('.hud .flint > span').text(flint);
		$('.hud .tool > span').text(tool);
		_journal("You made a hammer. I don't know why. There aren't any nails here.");
	} else {
		_journal("You don't have enough stuff to do build anything.");
	}
});

$('.shelter').on('click', function (){
	if (stick >= 6 && flint >= 3 && tool >= 1){		
		stick = stick - 6;
		flint = flint - 3;
		tool = tool - 1;
		shelter++;
		$('.hud .stick > span').text(stick);
		$('.hud .flint > span').text(flint);
		$('.hud .tool > span').text(tool);
		$('.hud .shelter > span').text(shelter);
		_journal("Is it a lean-to? A cabin? No idea. This game doesn't have graphics! Also, your hammer broke.");
	} else {
		_journal("You don't have enough stuff to do build anything.");
	}
});

$('.fire').on('click', function (){
	if (stick >= 3 && flint >= 6){		
		stick = stick - 3;
		flint = flint - 6;
		fire++;
		$('.hud .stick > span').text(stick);
		$('.hud .flint > span').text(flint);
		$('.hud .fire > span').text(fire);
		_journal("Is it a lean-to? A cabin? No idea. This game doesn't have graphics!");
	} else {
		_journal("You don't have enough stuff to do build anything.");
	}
});

document.addEventListener('keydown', function(e){
	if (energy > 0){
		     if (event.which == 37)	{_moveLeft()}
		else if (event.which == 39)	{_moveRight()}
		else if (event.which == 38)	{_moveUp()}
		else if (event.which == 40)	{_moveDown()}
		else if (event.which == 32)	{_pressSpace()}
		else if (event.which == 9)	{_pressTab()}
		else if (event.which == 77)	{_pressM()}
		else {_journal("Unknown keydown")}

		if ($('.occupied').hasClass('stick')){
			_steppedOnStick();
		} else if ($('.occupied').hasClass('flint')){
			_steppedOnFlint();
		} else if ($('.occupied').hasClass('water')){  		
			_steppedOnWater();
		} else if ($('.occupied').hasClass('lava')){  		
			_steppedOnLava();
		}
	} else {
		_pressTab();
		$('.grid').css('transform', 'translate('+originalLeft+'px, '+originalTop+'px)');
		// $('.hud').addClass('gameOver');
	}
});


