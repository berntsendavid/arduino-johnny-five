// server.js
var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
var io = require('socket.io')(httpServer);

var port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

httpServer.listen(port);
console.log('Server available at http://localhost:' + port);
var leds = [];
var counter = 0;
var servo;
var servo_pos = 0;
//Arduino board connection

function countdown() {
		led = leds[counter];
		led.on();
		counter++;
		if (counter < leds.length){
				setTimeout(countdown, 1000);
		}else {
				servo.to(5);
				counter = 0;
		}
}

var board = new five.Board();
board.on("ready", function() {
    console.log('Arduino connected');
		for (i=2;i<5;++i){
				leds.push(new five.Led(i));
		}
		servo = new five.Servo({
				pin: 8
		});
});

//Socket connection handler
io.on('connection', function (socket) {
    console.log(socket.id);

    socket.on('launch', (data) => {
				countdown();
    });

    socket.on('reset', (data) => {
				leds.map((led) => led.off());
				servo.to(80);
    });

    socket.on('open', (data) => {
				servo.to(5);
    });

    socket.on('close', (data) => {
				servo.to(80);
    });

});

console.log('Waiting for connection');
