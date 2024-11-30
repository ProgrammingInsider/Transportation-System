// Db_connection
import con from "../Db/connection.js";
import { queryDb } from "../query/get.js";


// Function to update vehicle status based on trip count
export const updateVehicleStatus = async () => {
    try {
        // SQL query to count trips per vehicle for the last month
        const countTripsQuery = `
            SELECT Plate_Number, COUNT(*) AS TripCount
            FROM trip
            WHERE STR_TO_DATE(Date_Time, '%m/%d/%Y') >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
            GROUP BY Plate_Number;
        `;

        const tripCounts = await queryDb(countTripsQuery);
        

        // Array to hold Plate_Numbers of vehicles to update
        const vehiclesToBan = [];

        tripCounts.forEach(row => {
            if (row.TripCount < 25) {
                vehiclesToBan.push(row.Plate_Number); // Collect vehicles with less than 25 trips
            }
        });

        // Update status of vehicles in the vehicle table
        if (vehiclesToBan.length > 0) {
            const updateStatusQuery = `
                UPDATE vehicle
                SET Status = 0
                WHERE Plate_Number IN (?)
            `;
            con.query(updateStatusQuery, [vehiclesToBan]);
            console.log(`Updated vehicle status for: ${vehiclesToBan.join(', ')}`);
        } else {
            console.log('No vehicles to ban this month.');
        }

    } catch (error) {
        console.error('Error updating vehicle status:', error);
    }
};
