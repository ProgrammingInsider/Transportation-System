import {useEffect, useState} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

// COMPONENTS
import {useGlobalContext} from '../../contextAPI'

const DailyReportList = () => {
  const {auth} = useGlobalContext();
  const axiosPrivate = useAxiosPrivate();
  const [dailyReportList, setDailyReportLists] = useState([]);
  const [departureName, setDepartureName] = useState([]);
  const [singleDeparture, setSingleDeparture] = useState();
  const [error, setError] = useState(false);
  const[message,setMessage] = useState("There no vehicle records here.");

  const position = auth?.payload?.Position;

  useEffect(()=>{

    setSingleDeparture(departureName[0]?.Departure_Name);

  },[departureName])

  const filterByDepature = (e) => {
          const Departure_Name = e.target.value;
          setSingleDeparture(Departure_Name)
  }


  useEffect(()=>{
    const getVehicleLists = async() => {

      try {

        const resp = await axiosPrivate.get(`/dailyreport?Departure=${singleDeparture}`,{
            Headers:{
                Accept:'application/json'
            }
        }) 

        // if(singleDeparture === "All"){
        //     resp = await axiosPrivate.get("/vehicle",{
        //     Headers:{
        //         Accept:'application/json'
        //     }
        // }) 
            
        // }else{ 

           
            
        // }
    
        const {data} = resp;
        const {result, length, record}= data
           
        if(length>0){
          setDailyReportLists(result)
          setError(false)
        }else{
          setMessage(`There no Daily Report for ${singleDeparture} records here.`)
         setError(true)
        }
        
    } catch (err) {
      // Handle the error
         setError(true)
         if(!err?.response){
          console.log(!err?.response);
          setMessage("No server Response")
       }else if(err.response?.status === 400){
         setMessage("Missing information")
       }else if(err.response?.status === 401){
         setMessage("Unauthorized")
       }else if(err.response?.status === 403){
         setMessage("Forbidden")
       }else{
         setMessage("Fialed")
       }
      
      
    }

  }
            getVehicleLists();

    },[singleDeparture])

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
          
      } catch (error) {
        // Handle the error
        console.error('Error fetching data:', error);
      }
  
         
    }      
              getDepartureName();
  
      },[])

      

  return <>
    <div className='mainSection'>
      <h1 className='mainSectionHeader'>Daily Report</h1>

      <div className='departureDropDown'>
        <select name="departure" id="departure" className='dropDowns' onChange={filterByDepature}>
            {
              departureName.map((item,index)=>{
                const {Departure_Id,Departure_Name} = item
                  return (
                      <option key={Departure_Id} value={Departure_Name}>{Departure_Name}</option>
                  )
              })
            }
            
         </select>
      </div>
    
      <div className='tableContainer vehicleTable'>
        <table>
        <thead>
           <tr>
              <th>Agent Name</th>
              <th>Service Charge</th>
              <th>Departure Name</th>
              <th>Report Date</th>
           </tr>
        </thead>
        <tbody>

        {
           error
           ? <tr><td className='nullError' colSpan={11}>{message}</td></tr>
           : (

            dailyReportList.map((item,index)=>{
              const {Id,Agent_Name, Service_Charge, Departure, Report_Date} = item
               return(
                      <tr key={Id}>
                        <td >{Agent_Name}</td>
                        <td >{Service_Charge}</td>
                        <td >{Departure}</td>
                        <td >{Report_Date}</td>
                      </tr>
               )

              })
           )
        }

          </tbody>

        </table>
      </div>

   
      

    </div>
  </>
}

export default DailyReportList