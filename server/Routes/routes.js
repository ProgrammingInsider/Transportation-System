import express from 'express'
const app = express();
const router = express.Router();

// CONTROLLERS
import { Login, addDeparture, addFleetType, addArrival, addVehicle, addAgent,addAdmin, addTrip, addCheckIn, addDailyReport } from '../Controllers/insertControllers.js';

import { getAdmin, getDeparture, getFleetType,getVehicle,getAgent, getReport, getSingleVehicle, getDistinctArrival, getProfile, getAllArrival, getTrip, refresh, logout, getCheckIn, getPlateNumber, getDailyReport, getBlacklist } from '../Controllers/getControllers.js';

import { updateVehicle, updateAgent, updateArrivalLocation, updateAdmin, updateCheckedOut, resetQueue } from '../Controllers/updateControllers.js';

import { deleteAdmin, deleteVehicle, deleteAgent } from '../Controllers/deleteControllers.js';

// MIDDLEWARE
import { profileAuth } from '../middleware/Auth.js';


// POST ROUTES
router.route('/departure').post(profileAuth,addDeparture)
router.route('/fleettype').post(profileAuth,addFleetType)
router.route('/arrival').post(profileAuth,addArrival)
router.route('/vehicle').post(profileAuth,addVehicle)
router.route('/agent').post(profileAuth,addAgent)
router.route('/admin').post(addAdmin)
router.route('/trip').post(addTrip)
router.route('/dailyreport').post(addDailyReport)
router.route('/login').post(Login)
router.route('/checkin').post(profileAuth,addCheckIn)



// GET ROUTES
router.route('/logout').get(logout)
router.route('/refresh').get(refresh)

router.route('/departure').get(profileAuth,getDeparture)
router.route('/fleettype').get(profileAuth,getFleetType)
router.route('/arrival').get(profileAuth,getAllArrival)
router.route('/arrival/search').get(profileAuth,getDistinctArrival)
router.route('/vehicle').get(profileAuth,getVehicle)
router.route('/agent').get(profileAuth,getAgent)
router.route('/trip').get(profileAuth,getTrip)
router.route('/admin').get(getAdmin)
router.route('/report/search').get(profileAuth,getReport)
router.route('/vehicle/search').get(profileAuth,getSingleVehicle)
router.route('/profile').get(profileAuth,getProfile)
router.route('/checkin/search').get(profileAuth,getCheckIn)
router.route('/platenumbers').get(profileAuth,getPlateNumber)
router.route('/dailyreport').get(getDailyReport)
router.route('/blacklist').get(getBlacklist)





// PUT ROUTES
router.route('/vehicle').put(profileAuth,updateVehicle);
router.route('/admin').put(profileAuth,updateAdmin);
router.route('/agent').put(profileAuth,updateAgent);
router.route('/arrivallocation').put(profileAuth,updateArrivalLocation);
router.route('/resetqueue').put(profileAuth,resetQueue)
router.route('/checkout/update').put(profileAuth,updateCheckedOut)



// DELETE ROUTES
router.route('/admin/delete').delete(profileAuth,deleteAdmin)
router.route('/agent/delete').delete(profileAuth,deleteAgent)
router.route('/vehicle/delete').delete(profileAuth,deleteVehicle)

export default router;