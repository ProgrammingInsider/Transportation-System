// REACT ROUTER
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom'

// PAGES
import Dashboard from './Pages/Dashboard'
import Vehicle from './Pages/Vehicle'
import Admin from  './Pages/Admin'
import Departure from './Pages/Departure'
import Fleettype from './Pages/Fleettype'
import Arrival from './Pages/Arrival'
import Employee from './Pages/Employee'
import Report from './Pages/Report'
import Login from './Pages/Login'
import CheckInOut from './Pages/CheckInOut'
import Error from './Pages/Error'

// TEMPORARY PAGES
import AddVehicle from './Pages/AddVehicle'
import Register from './Pages/Register'
import AddDeparture from './Pages/AddDeparture'
import AddFleettype from './Pages/AddFleettype'
import AddArrival from './Pages/AddArrival'
import AddEmployee from './Pages/AddEmployee'
import DailyReport from './Pages/DailyReport'

// LAYOUT
import RootLayout from './Layout/RootLayout'
import ProtectedRoute from './Layout/ProtectedRoute'
import OwnerRoute from './Layout/OwnerRoute'
import LoginRoute from './Layout/LoginRoute'
import PersistLogin from './Layout/PersistLogin';

// CREATE ROUTER
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/*' element={<RootLayout/>}>
      <Route element={<LoginRoute/>}>
          <Route path='login' element={<Login/>} />
      </Route>

<Route element={<PersistLogin/>}>

    <Route element={<ProtectedRoute/>}>

      <Route exact index element={<Dashboard/>} />
      <Route path='vehicle/vehiclelist' element={<Vehicle/>} />
      <Route path='admin' element={<Admin/>} />
      <Route path='departure/departurelist' element={<Departure/>} />
      <Route path='fleettype/fleettypelist' element={<Fleettype/>} />
      <Route path='arrival/arrivallist' element={<Arrival/>} />
      <Route path='employee/employeelist' element={<Employee/>} />
      <Route path='checkinout' element={<CheckInOut/>} />
      <Route path='report/downloadreport' element={<Report/>} />


      <Route element={<OwnerRoute/>}>
        <Route path='vehicle/addvehicle' element={<AddVehicle/>} />
        <Route path='register' element={<Register/>} />
        <Route path='departure/adddeparture' element={<AddDeparture/>} />
        <Route path='fleettype/addfleettype' element={<AddFleettype/>} />
        <Route path='arrival/addarrival' element={<AddArrival/>} />
        <Route path='employee/addemployee' element={<AddEmployee/>} />
        <Route path='report/dailyreport' element={<DailyReport/>} />
      </Route>
      
    </Route>
    
</Route>

      <Route path='*' element={<Error/>} />
    </Route>
  )
)

const App = () => {
  return <>
       <RouterProvider router={router}/>
  </>
}

export default App