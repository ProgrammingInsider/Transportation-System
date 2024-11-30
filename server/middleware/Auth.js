import { UnauthenticatedError,ForbiddenRequest } from '../Errors/index.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();


export const profileAuth = (req,res,next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader && !authHeader?.startsWith('Bearer')){
         throw new UnauthenticatedError("No token Provided");
    }else{
     
     try{
     
          const token = authHeader.split(' ')[1];

             const decode = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
             const {Email, First_Name, Last_Name, Position} = decode;

             req.user= {Email, First_Name, Last_Name, Position}
            
             next();
             
     }catch(err){
          throw new ForbiddenRequest("Forbidden Request");
     }

    }       
}