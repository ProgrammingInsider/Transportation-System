import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


// STYLES
import'../Components/Dashboard/dashboard.css'

// COMPONENTS
import TripAnalytics from '../Components/Dashboard/TripAnalytics'

const Dashboard = () => {
  const navigate = useNavigate();
  

  return <>
      <TripAnalytics/>
  </>
}

export default Dashboard