import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

import { checkArrayLength } from './checkArrayLength.js'

// query
import { queryDb } from '../query/get.js';
import { postDb } from '../query/post.js';
import { updateDb } from '../query/update.js';
import { BadRequestError } from '../Errors/index.js';

// GET ALL DATA FROM ADMIN TABLE
export const Login = async (req,res) => {
    const {Email,Password} = req.body;

    if(!Email || !Password){
        throw new BadRequestError("Please Provide email and password")
    }

            const sql = `SELECT * FROM admin WHERE Email = "${Email}"`
            const queryResult = await queryDb(sql);
            const isNotNull = checkArrayLength(queryResult);
               if(isNotNull){
                   const isMatch = await bcrypt.compare(Password,queryResult[0].Password)
            
                     if(isMatch){

                        const {Email, First_Name, Last_Name, Position} = queryResult[0];

                        // create access token
                        const payload = {Email, First_Name, Last_Name, Position}
                        const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'20m'})

                        // create refresh token
                        const refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'})
                        
                        // store refresh token in a database
                        const refreshSql = `UPDATE admin SET RefreshToken = "${refreshToken}" WHERE Email="${Email}"`

                        await postDb(refreshSql);

                        res.cookie('jwt',refreshToken,{httpOnly:true, maxAge:24*60*60*1000,secure:true,sameSite:'None'})
                        res.status(200).json({EmailMatch:true, PasswordMatch:true, payload, accessToken}) 

                     }else{

                        res.status(200).json({EmailMatch:true, PasswordMatch:false}) 
                        
                     }
                 }else{
                     res.status(200).json({EmailMatch:false}) 
                 }
}

// INSERT DATA INTO DEPARTURE TABLE
export const addDeparture =  async (req,res) => {
    const {Departure_Name} = req.body;

    if(!Departure_Name){
        throw new BadRequestError("Please Provide departure")
    }
    
    //CHECK EXISTANCE QUERY 
    const existanceSql = `SELECT Departure_Name FROM departuretown WHERE Departure_Name = "${Departure_Name}"` 
    const queryResult = await queryDb(existanceSql);
    const isNull = checkArrayLength(queryResult); 
    
    if(isNull){
        res.json({isRegistered:false, Message:`There is a registration with the ${Departure_Name} Departure`})
    }else{
        // INSERT QUERY    
            const insertSql = `INSERT INTO departuretown (Departure_Name) VALUES ("${Departure_Name}")`
            const postResult = await postDb(insertSql);
        
            if(postResult.affectedRows){
                res.json({isRegistered:true, Message:`${Departure_Name} registered as one of the the Departure`}) 
            }
    }
}

// INSERT DATA INTO FLEET TABLE
export const addFleetType =  async (req,res) => {
    const {Fleet_Name,Seat_Number} = req.body;

    if(!Fleet_Name || !Seat_Number){
        throw new BadRequestError("Please Provide Fleet Type and Seat Number")
    }
    
    //CHECK EXISTANCE QUERY 
    const existanceSql = `SELECT Fleet_Name FROM fleettype WHERE Fleet_Name = "${Fleet_Name}"`
    const queryResult = await queryDb(existanceSql);
    const isNull = checkArrayLength(queryResult); 

    if(isNull){
        res.status(200).json({isRegistered:false, Message:`There is a registration with the ${Fleet_Name} Fleet Type`})
    }else{
       // INSERT QUERY    
       const insertSql = `INSERT INTO fleettype (Fleet_Name,Seat_Number) VALUES ("${Fleet_Name}",${Seat_Number})`
       const postResult = await postDb(insertSql);
   
       if(postResult.affectedRows){
           res.status(200).json({isRegistered:true, Message:`${Fleet_Name} registered as one of the the Fleet Type`}) 
       }
    }

}

// INSERT DATA INTO ARRIVAL LOCATION TABLE
export const addArrival =  async(req,res) => {
    const {Departure_Location, Arrival_Location,Distance} = req.body;

    if(!Departure_Location || !Arrival_Location || !Distance){
        throw new BadRequestError("Please Provide Departure Location, Arrival Location and Distance")
    }
    
    //CHECK EXISTANCE QUERY 
    const existanceSql = `SELECT Departure_Location FROM arrivallocation WHERE Departure_Location = "${Departure_Location}" AND Arrival_Location = "${Arrival_Location}"`
    const queryResult = await queryDb(existanceSql);
    const isNull = checkArrayLength(queryResult); 

        if(isNull){
            res.status(200).json({isRegistered:false, Message:`This departure and arrival location already registered`})
        }else{

            // INSERT QUERY    
            const insertSql = `INSERT INTO arrivallocation (Departure_Location,Arrival_Location,Distance) VALUES ("${Departure_Location}","${Arrival_Location}",${Distance})`

            const postResult = await postDb(insertSql);

            if(postResult.affectedRows){
                res.status(200).json({isRegistered:true, Message:`The departure and arrival location registered Successfuly`}) 
            }
        }
}

// INCREASE TOTAL VEHICLE IN REPORT TABLE
const addReport = async(res,Departure_Name,updatedColumn, Message) => {
    
    //CHECK EXISTANCE QUERY 
    const existanceSql = `SELECT ${updatedColumn} AS Total FROM report WHERE Departure_Name = "${Departure_Name}"`
    const queryResult = await queryDb(existanceSql);
    const isNotNull = checkArrayLength(queryResult); 

    
    if(isNotNull){

        // UPDATE QUERY
        const current_Total = queryResult[0].Total;
        const increase_Total = current_Total + 1;

        const updateSql = `UPDATE report SET ${updatedColumn} = ${increase_Total} WHERE Departure_Name = "${Departure_Name}"`;
        
        const updateResult = await updateDb(updateSql)
        res.json({isRegistered:true,Message}) 
    
    }else{

        //  INSERT QUERY
        const insertSql = `INSERT INTO report (${updatedColumn},Departure_Name) VALUES (1,"${Departure_Name}")`;

        const postResult = await postDb(insertSql);
        if(postResult.affectedRows){
            res.json({isRegistered:true, Message}) 
        }   
    }
}


// INSERT DATA INTO VEHICLE TABLE
export const addVehicle = async(req,res) => {

    const {Plate_Number,Level,Association_Name,Region,Fleet_Name,Status,Seat_Number,Departure_Name} = req.body;
 
    
    //CHECK EXISTANCE QUERY 
    if(!Plate_Number || !Level || !Association_Name || !Region || !Fleet_Name || !Seat_Number || !Departure_Name){
        throw new BadRequestError("Please Provide all required information")
    }
    
    //CHECK EXISTANCE QUERY 
    const vehicleExistanceSql = `SELECT Plate_Number,Departure_Name FROM vehicle WHERE Plate_Number = "${Plate_Number}"`
    const queryResult = await queryDb(vehicleExistanceSql);
    const isNull = checkArrayLength(queryResult); 

        if(isNull){
            res.status(200).json({isRegistered:false, Message:`There is a vehicle registeration with this ${Plate_Number} Plate_Number at ${queryResult[0].Departure_Name} Departure Location`})
        }else{

            // INSERT QUERY    
            const insertSql = `INSERT INTO vehicle (Plate_Number,Level,Association_Name,Region,Fleet_Name,Status,Seat_Number,Departure_Name) VALUES ("${Plate_Number}",${Level},"${Association_Name}","${Region}","${Fleet_Name}",${Status},${Seat_Number},"${Departure_Name}")`

            const postResult = await postDb(insertSql);
            
            if(postResult.affectedRows){               
                addReport(res,Departure_Name,"Total_Vehicle",`Vehicle Registered Successfully`)
            }
        }
}


// INSERT DATA INTO AGENT TABLE
export const addAgent = async(req,res) => {

    const {First_Name,Last_Name,Phone_Number,Departure_Name,Password} = req.body;

    
    if(!First_Name || !Last_Name || !Phone_Number || !Departure_Name || !Password){
        throw new BadRequestError("Please Provide all required information")
    }
    
    //CHECK EXISTANCE QUERY 
   const existanceSql = `SELECT Phone_Number FROM agent WHERE Phone_Number = "${Phone_Number}"`
   const queryResult = await queryDb(existanceSql);
   const isNull = checkArrayLength(queryResult); 

        if(isNull){
            res.status(200).json({isRegistered:false, Message:`There is a registeration with this ${Phone_Number} Phone number`})
        }else{

            // INSERT QUERY    
            const insertSql = `INSERT INTO agent (First_Name,Last_Name,Phone_Number,Departure_Name,Password) VALUES ("${First_Name}","${Last_Name}","${Phone_Number}","${Departure_Name}","${Password}")`

            const postResult = await postDb(insertSql);
            
            if(postResult.affectedRows){               
                addReport(res,Departure_Name,"Total_Employee",`Agent Registered Successfully`)
            }
        }

}

// INSERT DATA INTO ADMIN TABLE
export const addAdmin = async (req,res) => {
    
    const {Email, First_Name, Last_Name, Password, Position} = req.body;
 
    if(!Email || !First_Name || !Last_Name || !Password){
        throw new BadRequestError("Please Provide all require information")
    }
    
    //CHECK EXISTANCE QUERY 
    const existanceSql = `SELECT Email FROM admin WHERE Email = "${Email}"`;
    const queryResult = await queryDb(existanceSql);
    const isNull = checkArrayLength(queryResult); 

        if(isNull){
            res.status(200).json({isRegistered:false, Message:`There is an admin registration with this ${Email} Email`})
        }else{

            // INSERT QUERY    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password,salt);

            const insertSql = `INSERT INTO admin (Email,First_Name,Last_Name,Password,Position) VALUES ("${Email}","${First_Name}","${Last_Name}","${hashedPassword}",${Position})`

            const postResult = await postDb(insertSql);

            if(postResult.affectedRows){
                res.status(200).json({isRegistered:true, Message:`registerated Successfully`}) 
            }
        }
}

// INCREASE TOTAL TRIP AND PASSENGER PER DEPARTURE
const addTripReport = async(res,Departure_Name,Seat_Number) => {

    const currentSql = `SELECT Total_Trip, Total_Passenger FROM report WHERE Departure_Name = "${Departure_Name}"`;
    const queryResult = await queryDb(currentSql);
    const isNull = checkArrayLength(queryResult); 

    if(isNull){

        // UPDATE QUERY
        const current_TotalTrip = queryResult[0].Total_Trip;
        const increase_TotalTrip = current_TotalTrip + 1;
    
        const current_TotalPassenger = queryResult[0].Total_Passenger;
        const increase_TotalPassenger = current_TotalPassenger + Seat_Number;

        const updateSql = `UPDATE report SET Total_Trip = ${increase_TotalTrip}, Total_Passenger = ${increase_TotalPassenger} WHERE Departure_Name = "${Departure_Name}"`;
        
        const updateResult = await updateDb(updateSql);
        res.json({isRegistered:true,Message:"Trip Registered Successfully"}) 
    }else{
        const insertSql = `INSERT INTO report (Total_Trip,Total_Passenger,Departure_Name) VALUES (${1}, ${Seat_Number},"${Departure_Name}")`
        await postDb(insertSql);
            
        res.json({isRegistered:true,Message:"Trip Registered Successfully"}) 
    }
    
}


// INSERT DATA INTO TRIP TABLE
export const addTrip = async (req,res) => {

    const {Plate_Number,Fleet_Name,Departure_Location,Arrival_Location,Total_Price,Level, Date_Time, Seat_Number} = req.body
    
    
    const levelToString = Level.toString().trimStart();
    const levelToNumber = levelToString.split(" ")[1];
    
    
    if(!Plate_Number || !Fleet_Name || !Departure_Location || !Arrival_Location || !Level || !Date_Time){
        throw new BadRequestError("Please Provide all require information")
    }

    const fleetExistanceSql = `SELECT * FROM fleettype WHERE Fleet_Name = "${Fleet_Name}"`
    const fleetTypeQuery = await queryDb(fleetExistanceSql);
    const isFleetTypeExist = checkArrayLength(fleetTypeQuery); 

    if(!isFleetTypeExist){
        res.status(200).json({isRegistered:false, Message:`${Fleet_Name} fleet type is not registered`})
    }
    //CHECK EXISTANCE QUERY 
    const vehicleExistanceSql = `SELECT Plate_Number FROM vehicle WHERE Plate_Number = "${Plate_Number}"`
    const queryResult = await queryDb(vehicleExistanceSql);
    const isNotNull = checkArrayLength(queryResult); 

        if(isNotNull){
    
             //  INSERT TRIP QUERY 
            const insertSql = `INSERT INTO trip (Plate_Number,Fleet_Name,Total_Price,Departure_Location,Arrival_Location, Level, Date_Time, Seat_Number) VALUES ("${Plate_Number}","${Fleet_Name}",${Total_Price},"${Departure_Location}","${Arrival_Location}",${levelToNumber}, "${Date_Time}", ${Seat_Number})`

            const postResult = await postDb(insertSql);
            
            if(postResult.affectedRows){
            addTripReport(res,Departure_Location,Seat_Number)
            }

        }else{
            res.status(200).json({isRegistered:false, Message:`There is no vehicle registration by this ${Plate_Number} for this Departure`})
        }
}

// INSERT CHEK-IN LIST
export const addCheckIn = async(req,res)=>{
     const {Plate_Number,Departure,Destination} = req.body;

     if(!Plate_Number || !Departure || !Destination){
        throw new BadRequestError("Please Provide all require information")
    }

    // CHECK REGISTRATION BY THIS DEPARTURE AND ARRIVAL
    const sql = `SELECT * FROM arrivallocation WHERE Departure_Location="${Departure}" AND Arrival_Location ="${Destination}"`;
       
       const queryResult = await queryDb(sql);
       const isNull = checkArrayLength(queryResult)
    
       if(isNull){
           
           // UPDATE ARRIVAL QUEUE 
           const queue = queryResult[0]?.Total_Queue ? queryResult[0]?.Total_Queue : 0
           const sql = `UPDATE arrivallocation SET Total_Queue = ${queue + 1} WHERE Departure_Location="${Departure}" AND Arrival_Location ="${Destination}"`
           await updateDb(sql);

           //INSERT CHECK IN 
           const insertSql = `INSERT INTO check_in_out (Plate_Number,Departure,Destination,queue_position)  VALUES("${Plate_Number}","${Departure}","${Destination}",${queue + 1})`
           await postDb(insertSql);

               res.json({success:true, queue_position: (queue + 1), message:"Check in registered"})
              
       }else{
            throw new BadRequestError("There is no registeration by this departure and destination");
       }
}

// DAILY REPORT
export const addDailyReport = async(req,res) => {
    const {Agent_Name, Service_Charge,Departure,Report_Date,totalRevenue} = req.body

    if(!Agent_Name || !Service_Charge  || !Departure || !Report_Date || !totalRevenue){
        throw new BadRequestError("Please Provide all require information")
    }

    //INSERT DAILY RPORT
    const insertSql = `INSERT INTO dailyreport (Agent_Name,Service_Charge,Departure,Report_Date,totalRevenue)  VALUES("${Agent_Name}",${Service_Charge},"${Departure}","${Report_Date}",${totalRevenue})`

    await postDb(insertSql);

    res.json({success:true, message:"Daily Revenue Report in Reported Successfully"})
}