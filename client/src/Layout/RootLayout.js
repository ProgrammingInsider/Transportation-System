import { useState,useEffect } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useNavigate } from 'react-router-dom';


// Icons
import { MdDashboard } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri"
import { MdDepartureBoard } from "react-icons/md";
import { GiStairsGoal } from "react-icons/gi";
import { MdSupportAgent } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineChecklistRtl } from "react-icons/md";

// LOGO
import logo from '../img/logo.png'

// Components
import Header from "../Components/Header";
import { useGlobalContext } from "../contextAPI";


const RootLayout = () => {
    const navigate = useNavigate();
    const {auth,hideSideBar,toggleSideBar} = useGlobalContext();
    const position = auth?.payload?.Position;
    const firstName = auth?.payload?.First_Name;
    const lastName = auth?.payload?.Last_Name;

    const[index,setIndex] = useState(0);
    const[subIndex,setSubIndex] = useState(0);


    useEffect(()=>{
        if(localStorage.getItem("index")){
            setIndex(parseInt(localStorage.getItem("index")));
            setSubIndex(parseInt(localStorage.getItem("index")))
          }
    },[])

    useEffect(()=>{
        if(!firstName || !lastName || !position){
            navigate("/login")
        }
    },[firstName])
   


    const handleIndex = (val) => {
        toggleSideBar(false)
        localStorage.setItem("index",val);

        if(val === subIndex){
            setSubIndex(0)
        }else{
            setSubIndex(val)
        }
    }
  return <>
     <div className='RootLayout'>
         <header className={!hideSideBar?"showSideBar":"hideSideBar"}>
         <div className='sideBarHeader'>

            <div className='Logo'>
             <img src={logo} alt="Logo" className='logoImg'/>
            </div>

            <div className='profileContainer'>
            <span className='profilePic'>{auth?.payload?.First_Name[0]}{auth?.payload?.Last_Name[0]}</span>
            {!hideSideBar && (<p className='profileName'>{auth?.payload?.First_Name} {auth?.payload?.Last_Name}</p>)}
            
            </div>
        </div>
            <nav className="sidebar">

                {/* DASHBOARD */}
                     <NavLink onClick={()=>{handleIndex(0);setIndex(0)}} to={"/"} className="mainMenu link">
                           <MdDashboard className="menuIcon"/>
                           {!hideSideBar && (<article className="menuName">Dashboard</article>)}
                    </NavLink>
               
               {/* VEHICLE */}
                <div className="eachLink">
                    <div className={index===1?"mainActive mainMenu":"mainUnActive mainMenu"} onClick={()=>{handleIndex(1);setIndex(1)}}>
                        <FaCarSide className="menuIcon"/>
                        {!hideSideBar && <>
                            <article className="menuName">Vehicle</article>
                            <IoIosArrowDown className={subIndex === 1?"showDropDown dropDown":"dropDown"}/>
                        </>}

                        
                    </div>
                   
                    {
                        (subIndex === 1 && !hideSideBar) && (
                            <div className="subMenu">
                                {
                                    (position === 1) && (

                                        <NavLink 
                                        style={({isActive})=>{
                                            return {backgroundColor: isActive? "#42d35a": ""}
                                        }} 
                                        to={"vehicle/addvehicle"} className="mainMenu link">
                                            Add Vehicle
                                        </NavLink>
                                    )
                                }

                                <NavLink 
                                style={({isActive})=>{
                                    return {backgroundColor: isActive? "#42d35a": ""}
                                }} 
                                to={"/vehicle/vehiclelist"} className="mainMenu link">
                                    Vehicle List
                                </NavLink>
                            </div>
                        )
                    }
                </div>

                {/* ADMIN */}
                <div className="eachLink">
                    <div className={index===2?"mainActive mainMenu":"mainUnActive mainMenu"} onClick={()=>{handleIndex(2);setIndex(2)}}>
                        <RiAdminFill className="menuIcon"/>
                        {!hideSideBar && <>
                            <article className="menuName">Admin</article>
                            <IoIosArrowDown className={subIndex === 2?"showDropDown dropDown":"dropDown"}/>
                        </>}
                        
                    </div>
                   
                    {
                        (subIndex === 2 && !hideSideBar) && (
                            <div className="subMenu">
                                {
                                    (position === 1) && (
                                        <NavLink 
                                        style={({isActive})=>{
                                            return {backgroundColor: isActive? "#42d35a": ""}
                                        }}
                                        to={"/register"} className="mainMenu link">
                                            Register
                                        </NavLink>
                                    )
                                }

                                <NavLink
                                style={({isActive})=>{
                                    return {backgroundColor: isActive? "#42d35a": ""}
                                }} 
                                to={"/admin"} className="mainMenu link">
                                    Admin List
                                </NavLink>

                            </div>
                        )
                    }
                </div>


                 {/* DEPARTURE */}
                 <div className="eachLink">
                    <div className={index===3?"mainActive mainMenu":"mainUnActive mainMenu"} onClick={()=>{handleIndex(3);setIndex(3)}}>
                        <MdDepartureBoard className="menuIcon"/>
                        {!hideSideBar && <>
                            <article className="menuName">Departure</article>
                            <IoIosArrowDown className={subIndex === 3?"showDropDown dropDown":"dropDown"}/>
                        </>}
                       
                    </div>
                   
                    {
                        (subIndex === 3 && !hideSideBar) && (
                            <div className="subMenu">
                                {
                                    (position === 1) && (

                                        <NavLink
                                        style={({isActive})=>{
                                            return {backgroundColor: isActive? "#42d35a": ""}
                                        }}  
                                        to={"/departure/adddeparture"} className="mainMenu link">
                                            Add Departure
                                        </NavLink>
                                    )
                                }

                                <NavLink
                                style={({isActive})=>{
                                    return {backgroundColor: isActive? "#42d35a": ""}
                                }}  
                                to={"/departure/departurelist"} className="mainMenu link">
                                    Departure List
                                </NavLink>
                            </div>
                        )
                    }
                </div>
               
                 {/* FLEET TYPE */}
                 <div className="eachLink">
                    <div className={index===4?"mainActive mainMenu":"mainUnActive mainMenu"} onClick={()=>{handleIndex(4);setIndex(4)}}>
                        <MdDepartureBoard className="menuIcon"/>
                        {!hideSideBar && <>
                            <article className="menuName">Fleet Type</article>
                            <IoIosArrowDown className={subIndex === 4?"showDropDown dropDown":"dropDown"}/>
                        </>}
                       
                    </div>
                   
                    {
                        (subIndex === 4 && !hideSideBar) && (
                            <div className="subMenu">
                                {
                                    (position === 1) && (

                                        <NavLink
                                        style={({isActive})=>{
                                            return {backgroundColor: isActive? "#42d35a": ""}
                                        }}  
                                        to={"fleettype/addfleettype"} className="mainMenu link">
                                            Add Fleet
                                        </NavLink>
                                    )
                                }

                                <NavLink
                                style={({isActive})=>{
                                    return {backgroundColor: isActive? "#42d35a": ""}
                                }}  
                                to={"fleettype/fleettypelist"} className="mainMenu link">
                                    Fleet List
                                </NavLink>
                            </div>
                        )
                    }
                </div>
                
               {/* ARRIVAL */}
               <div className="eachLink">
                    <div className={index===5?"mainActive mainMenu":"mainUnActive mainMenu"} onClick={()=>{handleIndex(5);setIndex(5)}}>
                        <GiStairsGoal className="menuIcon"/>
                        {!hideSideBar && <>
                            <article className="menuName">Arrival</article>
                            <IoIosArrowDown className={subIndex === 5?"showDropDown dropDown":"dropDown"}/>
                        </>}
                        
                    </div>
                   
                    {
                        (subIndex === 5 && !hideSideBar) && (
                            <div className="subMenu">
                                {
                                    (position === 1) && (

                                        <NavLink
                                        style={({isActive})=>{
                                            return {backgroundColor: isActive? "#42d35a": ""}
                                        }}  
                                        to={"/arrival/addarrival"} className="mainMenu link">
                                            Add Arrival
                                        </NavLink>
                                    )
                                }

                                <NavLink
                                style={({isActive})=>{
                                    return {backgroundColor: isActive? "#42d35a": ""}
                                }}  
                                to={"/arrival/arrivallist"} className="mainMenu link">
                                    Arrival List
                                </NavLink>
                            </div>
                        )
                    }
                </div>
                
                {/* EMPLOYEE */}
               <div className="eachLink">
                    <div className={index===6?"mainActive mainMenu":"mainUnActive mainMenu"} onClick={()=>{handleIndex(6);setIndex(6)}}>
                        <MdSupportAgent className="menuIcon"/>
                        {!hideSideBar && <>
                            <article className="menuName">Employee</article>
                            <IoIosArrowDown className={subIndex === 6?"showDropDown dropDown":"dropDown"}/>
                        </>}
                       
                    </div>
                   
                    {
                        (subIndex === 6 && !hideSideBar) && (
                            <div className="subMenu">
                                {
                                    (position === 1) && (
                                        
                                        <NavLink
                                        style={({isActive})=>{
                                            return {backgroundColor: isActive? "#42d35a": ""}
                                        }}  
                                        to={"/employee/addemployee"} className="mainMenu link">
                                            Add Employee
                                        </NavLink>
                                    )
                                }

                                <NavLink
                                style={({isActive})=>{
                                    return {backgroundColor: isActive? "#42d35a": ""}
                                }}  
                                to={"/employee/employeelist"} className="mainMenu link">
                                    Employee List
                                </NavLink>
                            </div>
                        )
                    }
                </div>

                {/* CHECK IN OUT */}
        
                <NavLink onClick={()=>setIndex(7)} to={"/checkinout"} className="mainMenu link">
                        <MdOutlineChecklistRtl  className="menuIcon"/>
                        {!hideSideBar && (<article className="menuName">Check-In-Out</article>)}
                        
                </NavLink>
                
                
                 {/* REPORT */}
               <div className="eachLink">
                    <div className={index===8?"mainActive mainMenu":"mainUnActive mainMenu"} onClick={()=>{handleIndex(8);setIndex(8)}}>
                        <TbReport className="menuIcon"/>
                        {!hideSideBar && <>
                            <article className="menuName">Report</article>
                            <IoIosArrowDown className={subIndex === 8?"showDropDown dropDown":"dropDown"}/>
                        </>}
                       
                    </div>
                   
                    {
                        (subIndex === 8 && !hideSideBar) && (
                            <div className="subMenu">
                                {
                                    (position === 1) && (

                                        <NavLink 
                                        style={({isActive})=>{
                                            return {backgroundColor: isActive? "#42d35a": ""}
                                        }} 
                                        to={"/report/downloadreport"} 
                                        className="mainMenu link"
                                        >
                                            Download Report
                                       
                                        
                                        </NavLink>
                                    )
                                }

                                <NavLink
                                style={({isActive})=>{
                                    return {backgroundColor: isActive? "#42d35a": ""}
                                }}  
                                to={"report/dailyreport"} className="mainMenu link">
                                    Daily Report
                                </NavLink>
                            </div>
                        )
                    }
                </div>
        
            </nav>
         </header>
         <main  className={!hideSideBar?"shrinkMain":"extendMain"} >
            <Header/>
            <Outlet/>
         </main>
     </div>
  </>
}

export default RootLayout