import React from 'react'

// REACT ROUTER
import { Outlet,Navigate,useLocation } from 'react-router-dom';

// GLOBAL CONTEXT
import { useGlobalContext } from '../contextAPI'

const OwnerRoute = () => {
    const {auth} = useGlobalContext();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"

    
  return (
      (auth?.payload?.Position === 1)
      ? <Outlet/>
      :<Navigate to={from} state={{from:location}} replace />
      
  )
}

export default OwnerRoute