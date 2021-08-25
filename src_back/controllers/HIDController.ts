import { Client } from 'node-osc';
import { Express, Request, Response } from "express-serve-static-core";
import SocketServer, { SOCK_ACTIONS } from "../server/SocketServer";
import Config from "../utils/Config";
import Logger from "../utils/Logger";

/**
* Created : 30/07/2021 
*/
export default class HIDController {

	private static _instance:HIDController;
	private _app:Express;
	private oscReady:boolean;
	private oscClient:Client;
	private id:number = 0;
	
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
		// Create OSC sender
		this.oscClient = new Client(Config.OSC_ADDRESS, Config.OSC_PORT);
		
		var HID = require('node-hid');
		//Init keyboard listener
		try {
			var device = new HID.HID( "/dev/input/by-id/usb-0513_0318-event-kbd" );
			device.on("data", (data:Buffer) => {
				let str = data.toString('hex');
				let keyIndex = str.indexOf("000100");
				let keyCode = str.substr(keyIndex+6,2);
				let inputType = str.substr(keyIndex+10,2);
				this.id = ++this.id%1000;
				// console.log(keyCode, inputType);
				let action;
				if(inputType == "01") action = SOCK_ACTIONS.KEY_DOWN;
				if(inputType == "02") action = SOCK_ACTIONS.KEY_PRESSED;
				if(inputType == "00") action = SOCK_ACTIONS.KEY_UP;
				//Send via OSC
				this.oscClient.send("/key/"+this.id+"/"+action+"/"+keyCode, (error):void => {
					if(error) {
						Logger.error("OSC error");
						console.log(error);
					}
				});
				//Send via WebSocket
				SocketServer.instance.broadcast({action, data:{keyCode, id:this.id}});
			});
		} catch(e) {
			Logger.error(e);
		}
	}
}