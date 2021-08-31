import { Express } from "express-serve-static-core";
import { Client } from 'node-osc';
import SocketServer, { SOCK_ACTIONS } from "../server/SocketServer";
import Config from "../utils/Config";
import Logger from "../utils/Logger";

/**
* Created : 30/07/2021 
*/
export default class HIDController {

	private static _instance:HIDController;
	private _app:Express;
	private oscClient:Client;
	private id:number = 0;
	private idToState:{[key:string]:string} = {};
	
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
			var device = new HID.HID( Config.KEYBOARD_PATH );
			device.on("data", (data:Buffer) => {
				let str = data.toString('hex');
				// console.log(str);
				// console.log("\r\n");
				let chunks = str.match(/.{32}/g);
				for (let i = 0; i < chunks.length; i++) {
					let line = chunks[i];
					if(/000700$/gi.test(line)) continue;//Dunno the meaning of these lines
					if(/0{18}$/gi.test(line)) continue;//Dunno the meaning of these lines
					let data = line.substr(14).match(/.{4}/g);
					if(data[0] != "0001") continue;//Dunno the meaning of these lines
					let keyCode = data[1].substr(2);
					let inputType = data[2].substr(2);
					
					let action;
					if(inputType == "01") action = SOCK_ACTIONS.KEY_DOWN;
					if(inputType == "02") action = SOCK_ACTIONS.KEY_PRESSED;
					if(inputType == "00") action = SOCK_ACTIONS.KEY_UP;

					this.broadcast(inputType, keyCode);
				}
			});
		} catch(e) {
			Logger.error(e);
		}
	}

	/**
	 * Broadcast a key event through websocket and OSC
	 * 
	 * @param inputType 
	 * @param keyCode 
	 * @returns 
	 */
	private broadcast(inputType:string, keyCode:string):void {
		if(this.idToState[keyCode] == inputType) return;
		this.idToState[keyCode] = inputType;

		this.id++;
		let action;
		if(inputType == "01") action = SOCK_ACTIONS.KEY_DOWN;
		if(inputType == "02") action = SOCK_ACTIONS.KEY_PRESSED;
		if(inputType == "00") {
			action = SOCK_ACTIONS.KEY_UP;
			delete this.idToState[keyCode];
		}
		//Send via OSC
		this.oscClient.send("/key/"+this.id+"/"+action+"/"+keyCode, (error):void => {
			if(error) {
				Logger.error("OSC error");
				console.log(error);
			}
		});
		//Send via WebSocket
		SocketServer.instance.broadcast({action, data:{keyCode, id:this.id}});
	}
}

/********************************************
 ********** KEYBOARD DATA EXAMPLES **********
 ********************************************

//PRESS 1 & 2 at the same time
73882e617ffa01		0004	0004	001e	000700
73882e617ffa01		0001	0002	0001	000000
73882e617ffa01		0004	0004	001f	000700
73882e617ffa01		0001	0003	0001	000000
73882e617ffa01		0000	0000	0000	000000


//PRESS ESCAPE
e4482e617b5803		0004	0004	0029	000700
e4482e617b5803		0001	0001	0001	000000
e4482e617b5803		0000	0000	0000	000000

//PRESS 1
e4482e61214e06		0004	0004	001e	000700
e4482e61214e06		0001	0002	0001	000000
e4482e61214e06		0000	0000	0000	000000



//KEEP PRESSED ESCAPE
9a862e6160a409		0001	0001	0002	000000
9a862e6160a409		0000	0000	0001	000000

//KEEP PRESSED 1
c3862e61b66601		0001	0002	0002	000000
c3862e61b66601		0000	0000	0001	000000



//RELEASE ESCAPE
e5482e61f1de04		0004	0004	0029	000700
e5482e61f1de04		0001	0001	00000	00000
e5482e61f1de04		0000	0000	0000	000000

//RELEASE 1
e5482e61311907		0004	0004	001e	000700
e5482e61311907		0001	0002	0000	000000
e5482e61311907		0000	0000	0000	000000

 */