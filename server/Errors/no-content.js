import CustomAPIError from "./custom-erros.js";
import {StatusCodes} from 'http-status-codes';

class NoContent extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.NO_CONTENT
    }
}

export default NoContent