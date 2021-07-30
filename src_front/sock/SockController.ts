import * as tmi from "tmi.js";
import { EventDispatcher } from '@/utils/EventDispatcher';
import * as SockJS from "sockjs-client";
import Config from "../utils/Config";
import SocketEvent from "../vo/SocketEvent";
import Vue from 'vue';

/**
 * Created by Durss on 28/03/2019
 */

export default class SockController extends EventDispatcher {

	private static _instance: SockController;

	private _sockjs: any;
	private _timeout: number;
	private _pingInterval: number;
	private _attempts: number;
	private _lastMessage : string;
	private _connected : boolean = false;
	private _enabled : boolean = false;
	private _verbose : boolean = false;
	private _rebroadcastInterval : any;

	constructor() {
		super();
		this.initialize();
	}

	/********************
	 * GETTER / SETTERS *
	 ********************/
	static get instance(): SockController {
		if (!SockController._instance) SockController._instance = new SockController();
		return SockController._instance;
	}

	public get connected():boolean {
		return this._connected;
	}

	public set keepBroadcastingLastMessage(value:boolean) {
		clearInterval(this._rebroadcastInterval);
		if(value){
			this._rebroadcastInterval = setInterval(_=> {
				if(this._verbose) console.log("SC :: rebroadcast last message");
				if(this._lastMessage) {
					this._sockjs.send(this._lastMessage);
				}
			}, 1000);
		}
	}


	/******************
	 * PUBLIC METHODS *
	 ******************/

	public connect() {
		this._enabled = true;
		if(this.connected) return;
		if(this._verbose) console.log("SC :: connect...");
		
		clearTimeout(this._timeout);

		if(this._sockjs) {
			//remove handlers from old sockjs
			this._sockjs.onclose = null;
			this._sockjs.onmessage = null;
			this._sockjs.onopen = null;
		}

		this._sockjs = new SockJS(Config.SOCKET_PATH);
		this._sockjs.onopen = ()=> this.onConnect();
		this._sockjs.onclose = (e)=> this.onClose(e);
		this._sockjs.onmessage = (message:string)=> this.onMessage(message);
	}

	/**
	 * Disconnects socket.
	 * Called by default on page close
	 */
	public disconnect() {
		if(this._verbose) console.log("SC :: disconnect");
		this._enabled = false;
		if(this._connected) {
		}
		this._connected = false;
		clearTimeout(this._timeout);
		this._timeout = <any>setTimeout(_=> {
			try {
				this._sockjs.close();
			}catch(e) {/*ignore*/}
		}, 500);
	}

	/**
	 * Send a message to the group
	 */
	public action(data:{action:string, data?:any}):void {
		if(this._verbose) console.log("SC :: action", data);
		if(!this._connected) {
			//Postpone send if connexion not yet establised
			if(this._verbose) console.log("SC :: postpone...", data)
			setTimeout(_=> this.action(data), 250);
		}else{
			if(this._verbose) console.log("SC :: action : do()")
			this._lastMessage = JSON.stringify(data),
			this._sockjs.send(this._lastMessage);
		}
	}


	/*******************
	 * PRIVATE METHODS *
	 *******************/
	/**
	 * Initializes the class
	 */
	private initialize(): void {
		Vue.observable(this);
		window.addEventListener('beforeunload', _=> this.disconnect());
	}


	private onConnect():void {
		if(this._verbose) console.log("SC :: onConnect");
		this._connected = true;
		this._attempts = 0;
		
		clearInterval(<any>this._pingInterval);
		this._pingInterval = <any>setInterval(_=>this.ping(), 30000);
		this.dispatchEvent(new SocketEvent(SOCK_ACTIONS.ONLINE, null));
	}

	private ping():void {
		this._sockjs.send(JSON.stringify({action:SOCK_ACTIONS.PING}));
	}

	private onClose(e):void {
		if(this._verbose) console.log("SC :: onClose", e);
		this._connected = false;
		this.dispatchEvent(new SocketEvent(SOCK_ACTIONS.OFFLINE, null));
		clearInterval(this._pingInterval);

		if(this._enabled) {
			// Attempt to reconnect
			if(++this._attempts == 20) return;
			this._timeout = <any>setTimeout(_=> this.connect(), 500);
		}
	}

	private onMessage(message:any):void {
		let json:any = JSON.parse(message.data);
		// console.log("Sock message");
		// console.log(json);
		this.dispatchEvent(new SocketEvent(json.action, json.data));
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