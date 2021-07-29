import HTTPServer from "./server/HTTPServer";
import Config from "./utils/Config";

new HTTPServer(Config.SERVER_PORT);

// var Keyboard = require('node-keylogger');
// var k = new Keyboard('event0'); // 'event0' is the file corresponding to my keyboard in /dev/input/
// k.on('keyup', console.log);
// k.on('keydown', console.log);
// k.on('keypress', console.log);
// k.on('error', console.error);


// import keylogger from "keylogger.js";
// // or
// // const keylogger = require("keylogger.js");

// keylogger.start((key, isKeyUp) => {
//   console.log("keyboard event", key, isKeyUp);
// });

var HID = require('node-hid');
var device = new HID.HID( "/dev/input/by-id/usb-0513_0318-event-kbd" );
device.on("data", (data:Buffer) => {
	console.log(data.toString('hex'));
});

console.log("Keyboard ready");