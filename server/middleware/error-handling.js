import { CustomAPIError } from "../Errors/index.js";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err,req,res,next) => {
    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json({msg:err.message})
    }

    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('something went wrong try again later')
}

export default errorHandlerMiddleware;


