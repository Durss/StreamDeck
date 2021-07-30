import { Express, Request, Response } from "express-serve-static-core";

/**
* Created : 08/07/2021 
*/
export default class APIController {

	private _app:Express;
	
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