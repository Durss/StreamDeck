import { Express, Request, Response } from "express-serve-static-core";
import SocketServer, { SOCK_ACTIONS } from "../server/SocketServer";

/**
* Created : 30/07/2021 
*/
export default class HIDController {

	private static _instance:HIDController;
	private _app:Express;
	
	constructor() {
	
	}
	
	/********************
	* GETTER / SETTERS *
	********************/
	static get instance():HIDController {
		if(!HIDController._instance) {
			HIDController._instance = new HIDController();
		}
		return HIDController._instance;
	}
	
	
	
	/******************
	* PUBLIC METHODS *
	******************/
	public create(app:Express):void {
		this._app = app;
		this.initialize();
	}
	
	
	
	/*******************
	* PRIVATE METHODS *
	*******************/
	private initialize():void {
		var HID = require('node-hid');
		var device = new HID.HID( "/dev/input/by-id/usb-0513_0318-event-kbd" );
		device.on("data", (data:Buffer) => {
			let str = data.toString('hex');
			let keyIndex = str.indexOf("000100");
			let keyCode = str.substr(keyIndex+6,2);
			let inputType = str.substr(keyIndex+10,2);
			console.log(keyCode, inputType);
			let action;
			if(inputType == "01") action = SOCK_ACTIONS.KEY_DOWN;
			if(inputType == "02") action = SOCK_ACTIONS.KEY_PRESSED;
			if(inputType == "00") action = SOCK_ACTIONS.KEY_UP;
			SocketServer.instance.broadcast({action, data:{keyCode}});
		});
	}
}