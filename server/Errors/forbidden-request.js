import CustomAPIError from "./custom-erros.js";
import {StatusCodes} from 'http-status-codes';

class ForbiddenRequest extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
    }
}

export default ForbiddenRequest