import * as sockjs from "sockjs";
import {Connection, ServerOptions} from "sockjs";
import Logger, { LogStyle } from "../utils/Logger";
import Config from "../utils/Config";
import SocketEvent from "../vo/SocketEvent";
import { EventDispatcher } from "../utils/EventDispatcher";

/**
 * Created by Durss on 28/03/2019
 */

export default class SocketServer extends EventDispatcher {


	private static _instance: SocketServer;
	private _DISABLED: boolean = false;
	private _sockjs: any;
	private _connections:Connection[];

	constructor() {
		super()
		this.initialize();
	}

	/********************
	 * GETTER / SETTERS *
	 ********************/
	static get instance(): SocketServer {
		if (!SocketServer._instance) SocketServer._instance = new SocketServer();
		return SocketServer._instance;
	}


	/******************
	 * PUBLIC METHODS *
	 ******************/

	public connect() {
		if(this._DISABLED) return;
		this._sockjs = sockjs.createServer({log: (severity, message)=> {
			if(severity == "debug") {
				Logger.success(message+" on port "+Config.SERVER_PORT);
				return;
			}
		}});
		this._sockjs.on("connection", (conn:Connection)=> this.onConnect(conn));
	}

	/**
	 * Broadcast a message to all pears
	 * @param msg
	 */
	public broadcast(msg:{action:SOCK_ACTIONS, data?:any}) {
		if(this._DISABLED) return;
		// Logger.info("BROADCAST to "+this._connections.length+" users : ", msg.action);
		for (let i = 0; i < this._connections.length; ++i) {
			this._connections[i].write(JSON.stringify(msg));
		}
		this.dispatchEvent(new SocketEvent(msg.action, msg.data));
	}

	/**
	 * Connects express to socket
	 * @param server
	 * @param scope
	 */
	public installHandler(server, scope : ServerOptions) {
		if(this._DISABLED) return;
		this.connect();
		this._sockjs.installHandlers(server, scope);
	}



	/*******************
	 * PRIVATE METHODS *
	 *******************/
	/**
	 * Initializes the class
	 */
	private initialize(): void {
		if(this._DISABLED) return;
		this._connections = [];
	}

	private onConnect(conn:Connection):void {
		if(this._DISABLED) return;
		this._connections.push(conn);

		// Logger.info("Socket connexion opened : "+LogStyle.Reset+conn.id);
		conn.on("data", (message) => {
			let json:{action:SOCK_ACTIONS, data:any} = JSON.parse(message);
			if(json.action == SOCK_ACTIONS.PING) {
				//Don't care, just sent to check if connection's style alive
				return;
			}else{
				if(this._DISABLED) return;
				this.broadcast(json);
			}
		});
		conn.on("close", (p) => {
			this.onClose(conn);
		});
	}

	private onClose(conn:Connection):void {
		if(this._DISABLED) return;
		conn.close();
		// Logger.info("Socket connexion closed : "+LogStyle.Reset+conn.id);
		//Cleanup user's connection from memory
		let idx = this._connections.indexOf(conn);
		if(idx) {
			this._connections.splice(idx, 1);
		}
	}

}

export enum SOCK_ACTIONS {
	PING="PING",
	ONLINE="ONLINE",
	OFFLINE="OFFLINE",
	KEY_UP="KEY_UP",
	KEY_PRESSED="KEY_PRESSED",
	KEY_DOWN="KEY_DOWN",
};