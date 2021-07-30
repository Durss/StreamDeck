
/**
 * Created by Durss
 */
export default class Config {
	
	private static _ENV_NAME: EnvName;

	public static IS_PROD:boolean = /.*\.(com|fr|net|org|ninja|st)$/gi.test(window.location.hostname);

	public static TWITCH_SCOPES:string[] = ["chat:read","chat:edit","channel_editor"];

	/**
	 * Undocumented facultative stuff to keep basic installs simple
	 * 
	 * This actually allows me to have one instance of the server
	 * to run multiple frontends. The data will be split in files which names
	 * will be based on the value returned by this method.
	 */
	public static get profile():string {
		if(document.location.host.indexOf("durss") == -1
		&& document.location.host.indexOf("localhost") == -1) return null;
		return this.getEnvData({
			dev: null,
			prod: document.location.host.replace(/([a-z]+).durss.[a-z]+/gi, "$1"),
		});
	}

	public static init():void {
		let prod = this.IS_PROD;//document.location.port == "";
		if(prod) this._ENV_NAME = "prod";
		else this._ENV_NAME = "dev";
	}
	
	public static get SERVER_PORT(): number {
		return this.getEnvData({
			dev: 3013,
			prod: document.location.port,
		});
	}
	
	public static get API_PATH(): string {
		return this.getEnvData({
			dev: document.location.protocol+"//"+document.location.hostname+":"+Config.SERVER_PORT+"/api",
			prod:"/api",
		});
	}
	
	public static get API_PATH_ABSOLUTE(): string {
		let path = this.API_PATH;
		if(path.indexOf("http") == -1) {
			path = "https://"+document.location.host+path;
		}
		return path;
	}
	
	public static get SOCKET_PATH():string{
		return "http://192.168.0.12:3013/sock";
		if(this.IS_PROD) {
			return "/sock";
		}else{
			return window.location.origin.replace(/(.*):[0-9]+/gi, "$1")+":"+this.SERVER_PORT+"/sock";
		}
	};
	
	

	/**
	 * Extract a data from an hasmap depending on the current environment.
	 * @param map
	 * @returns {any}
	 */
	private static getEnvData(map: any): any {
		//Get the data from hashmap
		if (map[this._ENV_NAME] !== undefined) return map[this._ENV_NAME];
		return map[Object.keys(map)[0]];
	}
}

type EnvName = "dev" | "preprod" | "prod";