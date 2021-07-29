import { Express, Request, Response } from "express-serve-static-core";

/**
* Created : 08/07/2021 
*/
export default class APIController {

	private _app:Express;
	private _descriptionsCaches:{[key:string]:{[key:string]:string}} = {};
	private static _DESCRIPTION_CACHE_INVALIDATED:boolean;
	
	constructor() {
		this.initialize();
	}
	
	/********************
	* GETTER / SETTERS *
	********************/
	
	
	
	/******************
	* PUBLIC METHODS *
	******************/
	public create(app:Express):void {
		this._app = app;
		this._app.get("/api", (req:Request, res:Response) => this.getAPI(req,res));
	}

	public static invalidateDescriptionCache():void {
		this._DESCRIPTION_CACHE_INVALIDATED = true;
	}
	
	
	
	/*******************
	* PRIVATE METHODS *
	*******************/
	private initialize():void {
	}

	/**
	 * Gets app client ID
	 * 
	 * @param req 
	 * @param res 
	 */
	private async getAPI(req:Request, res:Response):Promise<void> {
		res.status(200).json({success:true, message:"Server up and running"});
	}

}