import React from 'react'

// REACT ROUTER
import { Outlet,Navigate,useLocation } from 'react-router-dom';

// GLOBAL CONTEXT
import { useGlobalContext } from '../contextAPI'

const LoginRoute = () => {  
const {auth} = useGlobalContext();
const location = useLocation();
const from = location.state?.from?.pathname || "/"

  return (
    
    (!auth?.payload?.First_Name && !auth?.payload?.Last_Name && !auth?.payload?.Email && auth?.payload?.Position !== 0 && auth?.payload?.Position !== 1)
    ? <Outlet/>
    : <Navigate to={from} state={{from:location}} replace />
    
)
}

export default LoginRoute