// controllers
import { checkArrayLength } from "./checkArrayLength.js";

// query
import { deleteDb } from "../query/delete.js";
import { queryDb } from "../query/get.js";
import { updateDb } from "../query/update.js";
import { BadRequestError } from "../Errors/index.js";

// DECREASE TOTAL VEHICLE IN REPORT TABLE
const decreaseReport = async(res,Departure_Name,updatedColumn, Message) => {
    
    //CHECK EXISTANCE QUERY 
    const existanceSql = `SELECT ${updatedColumn} AS Total FROM report WHERE Departure_Name = "${Departure_Name}"`
    const queryResult = await queryDb(existanceSql);
    const isNotNull = checkArrayLength(queryResult); 

    
    if(isNotNull){

        // UPDATE QUERY
        const current_Total = queryResult[0].Total;
        var decrease_Total = current_Total - 1;

        if(decrease_Total < 0){
            decrease_Total = 0;
        }

        const updateSql = `UPDATE report SET ${updatedColumn} = ${decrease_Total} WHERE Departure_Name = "${Departure_Name}"`;
        
        const updateResult = await updateDb(updateSql)
        res.json({isDeleted:true,Message,affectedRows:updateResult.affectedRows}) 
    
    }
}

export const deleteAdmin = async(req,res) => {
    const {Email} = req.query;
    
    //VALIDATION
    if(!Email){
        throw new BadRequestError("Please Provide all required information")
    }
    
    const deleteSql = `DELETE FROM admin WHERE Email = "${Email}"`;
    await deleteDb(deleteSql)

    res.json({isDeleted:true,Message:`Admin with ${Email} Email is deleted`});
}


export const deleteAgent = async (req,res) => {
    const {Phone_Number,Departure_Name} = req.query;

    //VALIDATION
    if(!Phone_Number || !Departure_Name){
        throw new BadRequestError("Please Provide all required information")
    }
    
    const deleteSql = `DELETE FROM agent WHERE Phone_Number = ${Phone_Number}`;
    await deleteDb(deleteSql)

    decreaseReport(res,Departure_Name,"Total_Employee",`Agent with ${Phone_Number} Phone Number is deleted`)

}

export const deleteVehicle = async(req,res) => {
    const {Plate_Number,Departure_Name} = req.query;
    
    //VALIDATION
    if(!Plate_Number || !Departure_Name){
        throw new BadRequestError("Please Provide all required information")
    }
    
    const deleteSql = `DELETE FROM vehicle WHERE Plate_Number = ${Plate_Number}`;
    await deleteDb(deleteSql)

    decreaseReport(res,Departure_Name,"Total_Vehicle",`Vehicle with ${Plate_Number} Plate Number is deleted`)

}