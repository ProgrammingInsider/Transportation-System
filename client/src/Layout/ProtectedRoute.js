import React from 'react'

// REACT ROUTER
import { Outlet,Navigate,useLocation } from 'react-router-dom';

// GLOBAL CONTEXT
import { useGlobalContext } from '../contextAPI'

const ProtectedRoute = () => {
    const {auth} = useGlobalContext();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/"

  return (
      (!auth?.payload?.First_Name && !auth?.payload?.Last_Name && !auth?.payload?.Email && auth?.payload?.Position !== 0 && auth?.payload?.Position !== 1)
      ? <Navigate to="/login" state={{from}} replace />
      : <Outlet/>
      
  )
}

export default ProtectedRoute