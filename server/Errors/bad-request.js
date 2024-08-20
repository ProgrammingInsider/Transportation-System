import CustomAPIError from "./custom-erros.js";
import {StatusCodes} from 'http-status-codes';

class BadRequest extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

export default BadRequest