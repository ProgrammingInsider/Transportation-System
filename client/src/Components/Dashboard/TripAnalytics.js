import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import {useNavigate} from "react-router-dom"

// ICONS
import { GrUserWorker } from "react-icons/gr";
import { GiNotebook } from "react-icons/gi";
import { FaBusAlt } from "react-icons/fa";
import { FaExpandArrowsAlt } from "react-icons/fa";

// QUERY
import { FetchAll,FetchByDeparture } from '../../axios/axios';

const TripAnalytics =  () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [departureName, setDepartureName] = useState([]);
  const [report, setReport] = useState([]);
  const [filterBy, setFilterBy] = useState();


  useEffect(()=>{

    const getDepartureName = async() => {

      try {

        const resp = await axiosPrivate.get("/departure",{
            Headers:{
                Accept:'application/json'
            }
        })


        const {data} = resp;
        const {result,record, status}= data

        setDepartureName(result)
        setFilterBy(result[0].Departure_Name)
        
        // return {result,record, status};
        
    } catch (error) {
      // Handle the error
      console.error('Error fetching data:', error);
    }
          
      }
            getDepartureName();

    },[])

    useEffect(()=>{
      const getFilterBy = async() => {

        try {

          var resp;
  
          if(filterBy === "All"){
              resp = await axiosPrivate.get("/report",{
              Headers:{
                  Accept:'application/json'
              }
          }) 
              
          }else{ 
  
              resp = await axiosPrivate.get(`report/search?Departure_Name=${filterBy}`,{
                  Headers:{
                      Accept:'application/json'
                  }
              }) 
              
          }
      
          const {data} = resp;
          const {result,record}= data
          
          if(record > 0){
            setReport(result[0]);
  
          }else{
           setReport({"Total_Passenger":0, "Total_Trip":0, "Total_Vehicle":0,"Total_Employee":0});
  
          }
          
      } catch (error) {
        // Handle the error
        console.error('Error fetching data:', error);
      }
        
      }
              
              getFilterBy();
  
      },[filterBy])



  return <>
       <div className='mainSection'>
        <h1 className='mainSectionHeader'>Trip and Passenger Analytics</h1>
        <ul className='DepartureContainer'>
          {
            departureName.map((item)=>{
              const {Departure_Id,Departure_Name} = item
              return ( 
                <li key={Departure_Id} className='DepartureName' onClick={()=>setFilterBy(Departure_Name)}>{Departure_Name}</li> 
              )

            })
          }
        
        </ul>

          <div className='totalAnalytics'>
            <div className='dashboardCard tripDashboard'>
                <div className='dashboardCardIconContainer'>
                <FaExpandArrowsAlt className='dashboardCardIcon'/>
                </div>
                <div className='dashboardCardText'>
                    <span className='dashboardName'>Total Trip</span>
                    <span className='dashboardNumber'>{report.Total_Trip}</span>
                </div>
            </div>

            <div className='dashboardCard passengerDashboard'>
                <div className='dashboardCardIconContainer'>
                  <GiNotebook className='dashboardCardIcon'/> 
                </div>
                <div className='dashboardCardText'>
                    <span className='dashboardName'>Total Passenger</span>
                    <span className='dashboardNumber'>{report.Total_Passenger}</span>
                </div>
            </div>

            <div className='dashboardCard vehicleDashboard'>
                <div className='dashboardCardIconContainer'>
                  <FaBusAlt className='dashboardCardIcon'/> 
                </div>
                <div className='dashboardCardText'>
                    <span className='dashboardName'>Total Vehicle</span>
                    <span className='dashboardNumber'>{report.Total_Vehicle}</span>
                </div>
            </div>

            <div className='dashboardCard employeeDashboard'>
                <div className='dashboardCardIconContainer'>
                <GrUserWorker className='dashboardCardIcon'/> 
                </div>
                <div className='dashboardCardText'>
                    <span className='dashboardName'>Total Employee</span>
                    <span className='dashboardNumber'>{report.Total_Employee}</span>
                </div>
            </div>
          </div>

       </div>
  </>
}

export default TripAnalytics