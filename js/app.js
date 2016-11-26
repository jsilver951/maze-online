// 37 Left
// 39 Right
// 38 Up
// 40 Down
// 32 Space
// 9 Tab
// 77 M

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
var wood = 0;
var max_wood = 10;
var stone = 0;
var max_stone = 10;


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
			console.log(water_timer + " Water is bad");
			if ($('.occupied').hasClass('water')){  		
				_steppedOnWater();
			} else {
				water_timer = 250;
				return;
			}
		}, water_timer);
	} else {
		console.log("Dude, get out of the fucking water.");
	}
}

var wood_timer = 0;
function _steppedOnWood() {
	if (wood < max_wood){
		wood_timer++;
		setTimeout(function(){
			if ($('.occupied').hasClass('wood')){
				wood++;
				$('.hud .wood > span').text(wood);
				console.log("It took you "+ wood_timer +" seconds to collect 1 wood from here.");
				_steppedOnWood();
			} else {
				wood_timer = 0;
				return;
			}
		}, wood_timer*1000);
	} else {
		console.log("You cannot carry anymore wood.");
	}
}

var stone_timer = 0;
function _steppedOnStone() {
	if (stone < max_stone){
		stone_timer++;
		setTimeout(function(){
			if ($('.occupied').hasClass('stone')){
				stone++;
				$('.hud .stone > span').text(stone);
				console.log("It took you "+ stone_timer +" seconds to collect 1 stone from here.");
				_steppedOnStone();
			} else {
				stone_timer = 0;
				return;
			}
		}, stone_timer*1000);
	} else {
		console.log("You cannot carry anymore stone.");
	}
}

function _steppedOnLava() {
	energy = 0;
	$('.hud .energy > span').text(energy);
	console.log(random_lava_message);
}



document.addEventListener('keydown', function(e){
	// console.log(event.which);
	if (energy > 0){
		     if (event.which == 37)	{_moveLeft()}
		else if (event.which == 39)	{_moveRight()}
		else if (event.which == 38)	{_moveUp()}
		else if (event.which == 40)	{_moveDown()}
		else if (event.which == 32)	{_pressSpace()}
		else if (event.which == 9)	{_pressTab()}
		else if (event.which == 77)	{_pressM()}
		else {console.log("Unknown keydown")}

		if ($('.occupied').hasClass('wood')){
			_steppedOnWood();
		} else if ($('.occupied').hasClass('stone')){
			_steppedOnStone();
		} else if ($('.occupied').hasClass('water')){  		
			_steppedOnWater();
		} else if ($('.occupied').hasClass('lava')){  		
			_steppedOnLava();
		}
	} else {
		_pressTab();
		$('.grid').css('transform', 'translate('+originalLeft+'px, '+originalTop+'px)');
		$('.hud').addClass('gameOver');
	}
});


