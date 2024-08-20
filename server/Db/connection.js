import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config();

// FILES
// import { database } from './creation.js';
// import { adminTable } from './creation.js';
// import { departureTownTable } from './creation.js';
// import { fleetTypeTable } from './creation.js';
// import { arrivalLocationTable } from './creation.js';
// import { reportTable } from './creation.js';
// import { vehicleTable } from './creation.js';
// import { agentTable } from './creation.js';
// import { tripTable } from './creation.js';
// import { checkInOut } from './creation.js';
// import { dailyReport } from './creation.js';



// CREATE CONNECTION WITH DATABASE
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

export default con;

// CHECK IF IT IS CONNECTED, IF IT CONNECTED CREATE DATABASE AND TABLES
export const Db_connection = () => {
    con.connect(function(err){
        if(err) throw err;
        console.log("Connected");
        // console.log(database(con));
        // console.log(adminTable(con));
        // console.log(departureTownTable(con));
        // console.log(fleetTypeTable(con));
        // console.log(arrivalLocationTable(con));
        // console.log(reportTable(con));
        // console.log(vehicleTable(con));
        // console.log(agentTable(con));
        // console.log(tripTable(con));
        // console.log(checkInOut(con));
        // console.log(dailyReport(con));

    })
}