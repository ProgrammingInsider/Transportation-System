import {createContext,useContext, useState} from 'react'

const GlobalContext = createContext();


const ContextAPI = ({children}) => {
    const[auth,setAuth] = useState({}); 
    const[departureLocation,setDepartureLocation] = useState(); 
    const[hideSideBar,setSideBar] = useState(false);
    const[loggedIn,setLoggedIn] = useState(false);


    const toggleSideBar = (toggleValue) => {
          setSideBar(toggleValue);
    }

    const setUserLoggedIn= (val) => {
      setLoggedIn(val);
    }

 
  return (
    <GlobalContext.Provider value={{auth, setAuth, departureLocation,setDepartureLocation, hideSideBar,loggedIn,toggleSideBar,setUserLoggedIn}}>
        {children}
    </GlobalContext.Provider>
  )

}

export default ContextAPI


export const useGlobalContext = () => {
      return useContext(GlobalContext);
}
