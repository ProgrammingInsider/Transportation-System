import bcrypt from 'bcryptjs'

import { checkArrayLength } from './checkArrayLength.js';

// QUERY
import { queryDb } from '../query/get.js';
import { updateDb } from '../query/update.js';
import { BadRequestError } from '../Errors/index.js';

export const updateVehicle = async(req,res) => {

    const {Vehicle_Id, Plate_Number,Level,Association_Name,Region,Fleet_Name,Status,Seat_Number,Departure_Name} = req.body;

    //VALIDATION
    if(!Vehicle_Id || !Plate_Number || !Level || !Association_Name || !Region || !Fleet_Name || !Seat_Number || !Departure_Name){
        throw new BadRequestError("Please Provide all required information")
    }


    const plateNumberExistance = `SELECT plate_Number from vehicle WHERE  Vehicle_Id <> ${Vehicle_Id} AND plate_Number = ${Plate_Number}`;

    const queryResult = await queryDb(plateNumberExistance);
    const isNull = checkArrayLength(queryResult); 

    if(isNull){
        res.status(200).json({updatedData:false,Message:"Similar Plate Number is already registered",changedRows:0});

    }else{
    
       const updateSql = `UPDATE vehicle SET Plate_Number="${Plate_Number}",Level=${Level},Association_Name="${Association_Name}",Region="${Region}",Fleet_Name="${Fleet_Name}",Status=${Status},Seat_Number=${Seat_Number},Departure_Name="${Departure_Name}" WHERE Vehicle_Id = ${Vehicle_Id}`
      
      const updateResult = await updateDb(updateSql)

      res.status(200).json({updatedData:true,Message:"The record updated Succesfully",changedRows:updateResult.changedRows});
    }
    
}

export const updateAdmin = async(req,res) => {

    const {Admin_Id,Email,First_Name,Last_Name,OldPassword,NewPassword,Position} = req.body;

    
    //VALIDATION
    if(!Admin_Id || !Email || !First_Name || !Last_Name){
        throw new BadRequestError("Please Provide all required information")
    }

    // UPDATE DATA
    const updateData = async () => {

        var updateSql;
        
        if(OldPassword=="" || NewPassword==""){
            
            updateSql = `UPDATE admin SET Admin_Id=${Admin_Id},Email="${Email}",First_Name="${First_Name}",Last_Name="${Last_Name}",Position=${Position} WHERE Admin_Id = ${Admin_Id}`
            
        }else{

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(NewPassword,salt);

            updateSql = `UPDATE admin SET Admin_Id=${Admin_Id},Email="${Email}",First_Name="${First_Name}",Last_Name="${Last_Name}",Password="${hashedPassword}",Position=${Position} WHERE Admin_Id = ${Admin_Id}`

        }

        const updateResult = await updateDb(updateSql)
        res.status(200).json({updatedData:true,Message:"The record updated Succesfully",changedRows:updateResult.changedRows});
       
    }

     // CHECK PASSWORD MATCH
     const passwordQuery = async() => {
        const registeredPasswordSql = `SELECT Password from admin WHERE  Admin_Id = ${Admin_Id}`;
        const queryPassword = await queryDb(registeredPasswordSql);

        const passwordIsMatch = await bcrypt.compare(OldPassword,queryPassword[0].Password);
    
          if(passwordIsMatch){
            updateData();
          }else{
            res.status(200).json({updatedData:false,Message:"Your Old Password is not matched",changedRows:0});
          }
    }
    
    const EmailExistanceSql = `SELECT Password from admin WHERE  Admin_Id <> ${Admin_Id} AND Email = "${Email}"`;
    const queryResult = await queryDb(EmailExistanceSql);
    const isNull = checkArrayLength(queryResult); 

    if(isNull){
        res.status(200).json({updatedData:false,Message:"Similar Email is already registered",changedRows:0});

    }else{

      if(OldPassword=="" || NewPassword==""){
          updateData();
      }else{
          passwordQuery();
      }
    }
    
}


export const updateAgent = async(req,res) => {
    
    const {Agent_Id,First_Name,Last_Name,Phone_Number,Password,Departure_Name} = req.body;

    //VALIDATION
    if(!Agent_Id || !First_Name || !Last_Name || !Phone_Number || !Departure_Name){
        throw new BadRequestError("Please Provide all required information")
    }


    const agentExistance = `SELECT Phone_Number from agent WHERE Phone_Number = ${Phone_Number} AND Agent_Id <> ${Agent_Id}`;
    const queryResult = await queryDb(agentExistance);
    const isNull = checkArrayLength(queryResult); 

    if(isNull){
        res.status(200).json({updatedData:false,Message:"Similar Phone Number is already registered",changedRows:queryResult.changedRows});

    }else{
        const updateSql = `UPDATE agent SET First_Name="${First_Name}",Last_Name="${Last_Name}",Phone_Number="${Phone_Number}",Password="${Password}",Departure_Name="${Departure_Name}" WHERE Agent_Id = ${Agent_Id}`

        const updateResult = await updateDb(updateSql)
        res.status(200).json({updatedData:true,Message:"The record updated Succesfully",changedRows:updateResult.changedRows});
    }
}

export const updateArrivalLocation = async(req,res) => {
    
    const {Arrival_Id,Departure_Location,Arrival_Location,Distance} = req.body;

    //VALIDATION
    if(!Arrival_Id || !Departure_Location || !Arrival_Location || !Distance){
        throw new BadRequestError("Please Provide all required information")
    }

    const arrivalLocationExistance = `SELECT * from arrivallocation WHERE  Departure_Location = "${Departure_Location}" AND Arrival_Location = "${Arrival_Location}" AND Arrival_Id <> ${Arrival_Id}`;

    const queryResult = await queryDb(arrivalLocationExistance);
    const isNull = checkArrayLength(queryResult); 

    if(isNull){
        res.status(200).json({updatedData:false,Message:"Similar Departure and Arrival Location are already registered",changedRows:queryResult.changedRows});

    }else{
       const updateSql = `UPDATE arrivallocation SET Departure_Location="${Departure_Location}",Arrival_Location="${Arrival_Location}",Distance=${Distance} WHERE Arrival_Id = ${Arrival_Id}`

        const updateResult = await updateDb(updateSql)
        res.status(200).json({updatedData:true,Message:"The record updated Succesfully",changedRows:updateResult.changedRows});
    }
}

// UPDATE CHECK OUT
export const updateCheckedOut = async(req,res) => {
    const {Id,checkOut} = req.query;

    //VALIDATION
    if(!checkOut || !Id){
        throw new BadRequestError("Please Provide Valid query")
    }
    
    if(checkOut==="submit"){
            // Get current date and time
            let currentDate = new Date();

            // Format date components
            let year = currentDate.getFullYear();
            let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
            let day = String(currentDate.getDate()).padStart(2, '0');
            let hours = String(currentDate.getHours()).padStart(2, '0');
            let minutes = String(currentDate.getMinutes()).padStart(2, '0');
            let seconds = String(currentDate.getSeconds()).padStart(2, '0');

            // Combine date and time components into desired format
            let formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
         
            const sql = `UPDATE check_in_out SET check_out_time = "${formattedDateTime}" WHERE Id = ${Id}`

            await updateDb(sql)

            res.status(200).json({success:true, Message: "Checked Out Successfully"});

    }else if(checkOut==="cancel"){
        const sql = `UPDATE check_in_out SET check_out_time = "canceled" WHERE Id = ${Id}`

        await updateDb(sql)

        res.status(200).json({success:true, Message: "Checked Out canceled Successfully"});
    }else{
        throw new BadRequestError("Please Provide Valid query")
    }

    
}

// UPDATE QUEUE
export const resetQueue = async(req,res) => {
      const{Departure_Name}=req.query;

      //VALIDATION
      if(!Departure_Name){
            throw new BadRequestError("Please Provide Valid query")
        }
      const sql = `UPDATE arrivallocation SET Total_Queue = 0 WHERE Departure_Location = "${Departure_Name}"`
      await updateDb(sql);
      res.status(200).json({success:true, Message:"Queue Position Reseted successfully"})
}
