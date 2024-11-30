import cron from 'node-cron';
import retry from 'async-retry';
import { updateVehicleStatus } from './banVehicles.js';

const scheduleBan = async () => {
    try {
        await retry(async () => {
            await updateVehicleStatus();
        }, {
            retries: 3,
            factor: 2,
            minTimeout: 1000
        });
    } catch (error) {
        console.log('Unable to ban vehicles');
    }
};

// Function to get the last day of the current month
const getLastDayOfMonth = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return lastDay;
};

// Schedule a cron job that runs every day at 11:30 PM and checks if it’s the last day of the month
const banVehicle = cron.schedule('30 23 * * *', async () => {
    const today = new Date();
    const lastDay = getLastDayOfMonth();
    
    // Run only if today is the last day of the month
    if (today.getDate() === lastDay) {
        await scheduleBan();
    }
});

export { banVehicle };
