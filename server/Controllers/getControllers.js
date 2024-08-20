//MODULES
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config

import { BadRequestError, UnauthenticatedError,ForbiddenRequest,NoContent } from "../Errors/index.js";
import { checkArrayLength } from './checkArrayLength.js'

// Query
import { queryDb } from "../query/get.js";
import {updateDb} from "../query/update.js"


// GET PROFILE INFORMATION FROM TOKEN
export const getProfile = async(req,res) => {
    const {Email, First_Name, Last_Name, Position} = req.user;
    
    res.status(200).json({isLoggedIn:true, Email, First_Name, Last_Name, Position});
}

// REFRESH TOKEN
export const refresh = async (req,res)=>{
  const cookies = req.cookies;

   if(!cookies?.jwt){
    throw new UnauthenticatedError("No token Provided");
   }
   
   const refreshToken = cookies.jwt;
   
   const sql = `SELECT * FROM admin WHERE RefreshToken = "${refreshToken}"`;
   const queryResult = await queryDb(sql);
   const isNull = checkArrayLength(queryResult);

     if(isNull){
        try{
                
               const decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
  
               if(!decode){
                   throw new ForbiddenRequest("Forbidden Request");
                }else{
                    // create access token
                    const payload = {Email:queryResult[0].Email, First_Name:queryResult[0].First_Name, Last_Name:queryResult[0].Last_Name, Position:queryResult[0].Position}
                    
                    const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'20m'})
                      
                    res.json({payload, accessToken:token})
                    
                }
               
       }catch(err){
            throw new ForbiddenRequest("Forbidden Request");
       }
     } else{
        throw new ForbiddenRequest("Forbidden Request");
     }
  
}

// LOGOUT
export const logout = async (req,res)=>{
    const cookies = req.cookies;
  
     if(!cookies?.jwt){
        throw new NoContent("No Content to send back");
     }
  
     const refreshToken = cookies.jwt;
     const sql = `SELECT * FROM admin WHERE RefreshToken = "${refreshToken}"`;
     const queryResult = await queryDb(sql);
     const isNull = checkArrayLength(queryResult);
      
       if(isNull){
         const sql = `UPDATE admin SET RefreshToken = null WHERE RefreshToken="${refreshToken}"`
         await updateDb(sql);    
         res.clearCookie('jwt',{httpOnly:true, secure:true, sameSite:'None'})
         throw new NoContent("No Content to send back");    
         
       } else{
          res.clearCookie('jwt',{httpOnly:true, secure:true, sameSite:'None'})
          throw new NoContent("No Content to send back");
       }
    
  }

// GET ALL DATA FROM ADMIN TABLE
export const getAdmin = async (req,res) => {
   const sql = `SELECT * FROM admin`

   const queryResult = await queryDb(sql);
   const isNotNull = checkArrayLength(queryResult);
      
        if(isNotNull){
            res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
        }else{
            res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
        }
}

// GET ALL DATA FROM DEPARTURE TABLE
export const getDeparture = async(req,res) => {
    const sql = `SELECT * FROM departuretown`

    const queryResult = await queryDb(sql);
    const isNotNull = checkArrayLength(queryResult);
    
       
         if(isNotNull){
             res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
         }else{
             res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
         }
}

// GET ALL DATA FROM FLEET TYPE TABLE
export const getFleetType = async (req,res) => {
    const sql = `SELECT * FROM fleettype`

    const queryResult = await queryDb(sql);
    const isNotNull = checkArrayLength(queryResult);
      
        if(isNotNull){
            res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
        }else{
            res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
        } 
}

// GET ALL DATA FROM VEHICLE TABLE
export const getVehicle = async (req,res) => {
    const sql = `SELECT * FROM vehicle`

    const queryResult = await queryDb(sql);
    const isNotNull = checkArrayLength(queryResult); 
       
         if(isNotNull){
             res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
         }else{
             res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
         }
   
}

// GET ALL DATA FROM AGENT TABLE
export const getAgent = async(req,res) => {
         const sql = `SELECT * FROM agent`

        const queryResult = await queryDb(sql);
        const isNotNull = checkArrayLength(queryResult); 
    
         if(isNotNull){
             res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
         }else{
             res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
         }
}

// GET DISTINCT ARRIVAL LOCATION FROM ARRIVAL TABLE
export const getAllArrival = async(req,res) => {

        const sql = `SELECT * FROM arrivallocation`

        const queryResult = await queryDb(sql);
        const isNotNull = checkArrayLength(queryResult); 
       
         if(isNotNull){
             res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
         }else{
             res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
         }
}

// GET SOME DATA FROM REPORT TABLE
export const getReport = async(req,res) => {
    const {Departure_Name} = req.query;
    const sql = `SELECT * FROM report WHERE Departure_Name = "${Departure_Name}"`
    
    if(!Departure_Name){
        throw new BadRequestError("Please Provide departure name")
    }

    const queryResult = await queryDb(sql);
    const isNotNull = checkArrayLength(queryResult); 
       
         if(isNotNull){
             res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
         }else{
             res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
         }
}

// GET SOME DATA FROM VEHICLE TABLE
export const getSingleVehicle = async (req,res) => {
    const {Departure_Name} = req.query;

    const sql = `SELECT * FROM vehicle WHERE Departure_Name = "${Departure_Name}"`

    const queryResult = await queryDb(sql);
    const isNotNull = checkArrayLength(queryResult); 
       
         if(isNotNull){
             res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
         }else{
             res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
         }
}

// GET DISTINCT ARRIVAL LOCATION FROM ARRIVAL TABLE
export const getDistinctArrival = async(req,res) => {

    const {Departure_Location} = req.query;

    if(!Departure_Location){
        throw new BadRequestError("Please Provide departure name")
    }
    const sql =  `SELECT * FROM arrivallocation WHERE Departure_Location = "${Departure_Location}"`

    const queryResult = await queryDb(sql);
    const isNotNull = checkArrayLength(queryResult);
   
       
         if(isNotNull){
             res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
         }else{
             res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
         }
}

// GET TRIP
export const getTrip = async(req,res) => {

    const sql = `SELECT * FROM trip`

    const queryResult = await queryDb(sql);
    const isNotNull = checkArrayLength(queryResult);
       
         if(isNotNull){
             res.status(200).json({status:true, record:queryResult.length, result:queryResult}) 
         }else{
             res.status(200).json({status:false, record:queryResult.length, result:queryResult}) 
         }
}

// GET CHECK-IN-OUT
export const getCheckIn = async(req,res)=>{
    const {Destination} = req.query

    if(!Destination){
        throw new BadRequestError("Please Select Valid Destination")
    }

    const sql = `SELECT * FROM check_in_out WHERE Destination="${Destination}" AND check_out_time="Queued" ORDER BY check_in_time ASC, queue_position ASC;`

    const queryResult = await queryDb(sql);
    res.json({success:true, length:queryResult?.length, result:queryResult});
}

// GET ONLY PLATENUMBER
export const getPlateNumber = async(req,res)=>{
    const {Departure_Name} = req.query;
    if(!Departure_Name){
        throw new BadRequestError("Please Select Valid Departure")
    }
    const sql = `SELECT Plate_Number FROM vehicle WHERE Departure_Name = "${Departure_Name}"`

    const queryResult = await queryDb(sql);
    res.json({success:true, length:queryResult?.length, result:queryResult});
}

// GET DAILY REPORT
export const getDailyReport = async(req,res) => {
    const {Departure} = req.query;

    if(!Departure){
        throw new BadRequestError("Please Select Valid Departure")
    }

    const sql = `SELECT * FROM dailyreport WHERE Departure = "${Departure}"`

    const queryResult = await queryDb(sql);
    res.status(200).json({success:true, length:queryResult?.length, result:queryResult});
}


