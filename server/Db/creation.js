// // CREATE DATABASE
// export const database = (con) => {
//     const sql = 'CREATE DATABASE oromiatransport';
//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("database created");
//     })
// }

// // CREATE ADMIN TABLE
// export const adminTable = (con) => {

//     const sql = 'CREATE TABLE `admin` (`Admin_Id` int(11) NOT NULL AUTO_INCREMENT,`Email` varchar(255) NOT NULL, `First_Name` varchar(255) NOT NULL, `Last_Name` varchar(255) DEFAULT NULL,`Password` varchar(255) NOT NULL,`Position` tinyint(1) NOT NULL,`RefreshToken` varchar(255) DEFAULT NULL,PRIMARY KEY (`Admin_Id`),UNIQUE KEY `Email` (`Email`));'
//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("admin table created");
//     })
// }

// // CREATE DEPARTURE TOWN TABLE
// export const departureTownTable = (con) => {
//     const sql = 'CREATE TABLE `departuretown` (`Departure_Id` int(11) NOT NULL AUTO_INCREMENT,`Departure_Name` varchar(255) NOT NULL,PRIMARY KEY (`Departure_Name`),UNIQUE KEY `Departure_Id` (`Departure_Id`)) ';
//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("Departure Town table created");
//     })
// }

// // CREATE FLEET TYPE TABLE
// export const fleetTypeTable = (con) => {
//     const sql = 'CREATE TABLE `fleettype` (`Fleet_Id` int(11) NOT NULL AUTO_INCREMENT,`Fleet_Name` varchar(255) NOT NULL,`Seat_Number` int(11) NOT NULL,PRIMARY KEY (`Fleet_Name`),UNIQUE KEY `Fleet_Id` (`Fleet_Id`))';
//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("fleettype table created");
//     })
// }

// // CREATE ARRIVAL LOCATION TABLE
// export const arrivalLocationTable = (con) => {
//     const sql = 'CREATE TABLE `arrivallocation` (`Arrival_Id` int(11) NOT NULL AUTO_INCREMENT,`Departure_Location` varchar(255) NOT NULL,`Arrival_Location` varchar(255) NOT NULL,`Distance` decimal(65,1) unsigned NOT NULL,`Total_Queue` int(11) DEFAULT NULL,PRIMARY KEY (`Arrival_Id`),KEY `Departure_Location` (`Departure_Location`),CONSTRAINT `arrivallocation_ibfk_1` FOREIGN KEY (`Departure_Location`) REFERENCES `departuretown` (`Departure_Name`)) ';
//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("arrival table created");
//     })
// }

// // CREATE REPORT TABLE
export const reportTable = (con) => {
    const sql = 'CREATE TABLE report (Report_Id INT NOT NULL AUTO_INCREMENT, Total_Trip int(11) DEFAULT 0, Total_Passenger int(11) DEFAULT 0, Total_Vehicle int(11) DEFAULT 0, Total_Employee int(11) DEFAULT 0, Departure_Name VARCHAR(255) NOT NULL, Last_update DATETIME  NOT NULL DEFAULT NOW() ON UPDATE NOW(), PRIMARY KEY(Report_Id), FOREIGN KEY(Departure_Name) REFERENCES departuretown(Departure_Name), UNIQUE(Departure_Name));';
    con.query(sql,(err,result)=>{
        if (err) throw err
        console.log("report table created");
    })
}

// // CREATE VEHICLE TABLE
// export const vehicleTable = (con) => {
//     const sql = 'CREATE TABLE vehicle (Vehicle_Id INT NOT NULL AUTO_INCREMENT, Plate_Number VARCHAR(255) NOT NULL, Level INT NOT NULL, Association_Name VARCHAR(255) NOT NULL, Region VARCHAR(255) NOT NULL, Fleet_Name VARCHAR(255) NOT NULL, Status BOOL NOT NULL, Seat_Number INT NOT NULL, Departure_Name VARCHAR(255) NOT NULL, Registeration_Date DATETIME  NOT NULL DEFAULT NOW(), PRIMARY KEY(Plate_Number), FOREIGN KEY(Fleet_Name) REFERENCES fleettype(Fleet_Name), FOREIGN KEY(Departure_Name) REFERENCES departuretown(Departure_Name), UNIQUE(Vehicle_Id));';
//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("vehicle table created");
//     })
// }

// // CREATE AGENT TABLE
// export const agentTable = (con) => {
//     const sql = 'CREATE TABLE agent (Agent_Id INT NOT NULL AUTO_INCREMENT, First_Name VARCHAR(255) NOT NULL, Last_Name VARCHAR(255) NOT NULL, Phone_Number VARCHAR(255) NOT NULL, Password VARCHAR(255) NOT NULL, Departure_Name VARCHAR(255) NOT NULL, Registeration_Date DATETIME  NOT NULL DEFAULT NOW(), PRIMARY KEY(Agent_Id), FOREIGN KEY(Departure_Name) REFERENCES departuretown(Departure_Name));';
//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("agent table created");
//     })
// }

// // CREATE TRIP TABLE
// export const tripTable = (con) => {
//     const sql = 'CREATE TABLE trip (Id INT NOT NULL AUTO_INCREMENT, Trip_Id VARCHAR(255) NOT NULL, Plate_Number VARCHAR(255) NOT NULL, Region VARCHAR(255) NOT NULL, Fleet_Name VARCHAR(255) NOT NULL, Date_Time DATETIME  NOT NULL DEFAULT NOW(), Price DECIMAL(65,2) NOT NULL, Service_Price DECIMAL(65,2) NOT NULL, Total_Price DECIMAL(65,2) NOT NULL, Departure_Location VARCHAR(255) NOT NULL, Arrival_Location VARCHAR(255) NOT NULL, Seat_Number INT NOT NULL, Distance DECIMAL(65,1) NOT NULL, Agent_Name VARCHAR(255) NOT NULL, PRIMARY KEY(Id), FOREIGN KEY(Plate_Number) REFERENCES vehicle(Plate_Number), FOREIGN KEY(Fleet_Name) REFERENCES fleettype(Fleet_Name), FOREIGN KEY(Departure_Location) REFERENCES departuretown(Departure_Name), UNIQUE(Id));';
//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("trip table created");
//     })
// }

// // CREATE CHECK-IN-OUT TABLE
// export const checkInOut = (con) => {
//     const sql = `CREATE TABLE check_in_out ( 
//         Id INT AUTO_INCREMENT PRIMARY KEY,
//          Plate_Number VARCHAR(255) NOT NULL,
//          Departure VARCHAR(255) NOT NULL,
//          Destination VARCHAR(255) NOT NULL,
//          check_in_time DATETIME DEFAULT CURRENT_TIMESTAMP,
//          check_out_time VARCHAR(255) DEFAULT 'Queued',
//          queue_position INT,
//          FOREIGN KEY(Plate_Number) REFERENCES vehicle(Plate_Number),
//          FOREIGN KEY(Departure) REFERENCES departuretown(Departure_Name)
//          );`

//     con.query(sql,(err,result)=>{
//         if (err) throw err
//         console.log("checkinout table created");
//     })
// }

export const dailyReport = (con) => {
    const sql = `CREATE TABLE dailyreport ( 
        Id INT AUTO_INCREMENT PRIMARY KEY,
        Agent_Name VARCHAR(255) NOT NULL, 
        Service_Charge DECIMAL(65,2) NOT NULL,
        Departure VARCHAR(255) NOT NULL,
        Report_Date VARCHAR(255) NOT NULL,
        totalRevenue DECIMAL(65,2) NOT NULL,
        FOREIGN KEY(Departure) REFERENCES departuretown(Departure_Name)         
        );`

    con.query(sql,(err,result)=>{
        if (err) throw err
        console.log("Daily Report table created");
    })   
}


// CREATE NEW TRIP TABLE
export const tripTable = (con) => {
    const sql = 'CREATE TABLE trip (Id INT NOT NULL AUTO_INCREMENT, Plate_Number VARCHAR(255) NOT NULL, Fleet_Name VARCHAR(255) NOT NULL, Total_Price DECIMAL(65,2) NOT NULL, Departure_Location VARCHAR(255) NOT NULL, Arrival_Location VARCHAR(255) NOT NULL, Level varchar(255) NOT NULL, Date_Time varchar(255) DEFAULT NULL, Seat_Number int(11) DEFAULT NULL, PRIMARY KEY(Id), FOREIGN KEY(Plate_Number) REFERENCES vehicle(Plate_Number), FOREIGN KEY(Fleet_Name) REFERENCES fleettype(Fleet_Name), FOREIGN KEY(Departure_Location) REFERENCES departuretown(Departure_Name), UNIQUE(Id));';
    con.query(sql,(err,result)=>{
        if (err) throw err
        console.log("trip table created");
    })
}
