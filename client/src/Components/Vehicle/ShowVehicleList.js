import {useEffect, useState} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

// COMPONENTS
import VehicleCUD from './VehicleCUD';
import {useGlobalContext} from '../../contextAPI'

// ICONS
import { IoClose } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ShowVehicleList = () => {
  const {auth} = useGlobalContext();
  const axiosPrivate = useAxiosPrivate();
  const [placeholderData, setPlaceholderData] = useState();
  const [vehicleList, setVehicleLists] = useState([]);
  const [departureName, setDepartureName] = useState([]);
  const [totalVehicle, setTotalVehicle] = useState([]);
  const [singleDeparture, setSingleDeparture] = useState("All");
  const [error, setError] = useState(false);
  const status = ["Inactive","Active"]
  const[showModal, setShowModal] = useState(false);
  const[updateList, setUpdateList] = useState(false);
  const[deleteList, setDeleteList] = useState(false);
  const[message,setMessage] = useState("There no vehicle records here.");

  const position = auth?.payload?.Position;


  const filterByDepature = (e) => {
          const Departure_Name = e.target.value;
          setSingleDeparture(Departure_Name)
  }


  useEffect(()=>{
    const getVehicleLists = async() => {

      try {

        var resp;

        if(singleDeparture === "All"){
            resp = await axiosPrivate.get("/vehicle",{
            Headers:{
                Accept:'application/json'
            }
        }) 
            
        }else{ 

            resp = await axiosPrivate.get(`/vehicle/search?Departure_Name=${singleDeparture}`,{
                Headers:{
                    Accept:'application/json'
                }
            }) 
            
        }
    
        const {data} = resp;
        const {result,record}= data

        setTotalVehicle(record)
           
        if(record>0){
          setVehicleLists(result)
          setError(false)
        }else{
          setMessage("There no vehicle records here.")
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

    },[singleDeparture,updateList,deleteList])

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

      const updateRecord = (Id) => {
        vehicleList.map((item)=>{

          const {Vehicle_Id} = item;

              if(Vehicle_Id == Id){
                const {Vehicle_Id,Plate_Number,Level,Association_Name,Region,Fleet_Name,Status,Seat_Number,Departure_Name} = item;

                setPlaceholderData({VehicleId:Vehicle_Id,P_plateNumber:Plate_Number,P_level:Level,P_associationName:Association_Name,P_region:Region,P_fleetName:Fleet_Name,P_status:Status,P_seatNumber:Seat_Number,P_departureName:Departure_Name,formType:"Update"})

                setShowModal(true)
                
              }
              
         })

        }

      const  deleteRecord = async (plateNumber,departure) => {
        
          let text = `Are you sure you want to delete a Vehicle with ${plateNumber} plate number`;
          if (window.confirm(text) == true) {
            try {

              const {data} = await axiosPrivate.delete(`/vehicle/delete?Plate_Number=${plateNumber}&Departure_Name=${departure}`,{
                  Headers:{
                      Accept:'application/json'
                  }
              })
      
              const {isDeleted,Message} = data
              if(isDeleted){
                setDeleteList(true);
              }
              
          } catch (error) {
            // Handle the error
            console.error('Error deleting data:', error);
          }
            
        }
      }  
        

  return <>
    <div className='mainSection'>
      <h1 className='mainSectionHeader'>Vehicle Lists</h1>

      <div className='departureDropDown'>
        <select name="departure" id="departure" className='dropDowns' onChange={filterByDepature}>
            <option value="All">All</option>
            {
              departureName.map((item,index)=>{
                const {Departure_Id,Departure_Name} = item
                  return (
                      <option key={Departure_Id} value={Departure_Name}>{Departure_Name}</option>
                  )
              })
            }
            
         </select>
         <span className='totalVehicleLists'>Total Vehicle: {totalVehicle}</span>
      </div>
    
      <div className='tableContainer vehicleTable'>
        <table>
        <thead>
           <tr>
              <th>Plate Number</th>
              <th>Level</th>
              <th>Association Name</th>
              <th>Region</th>
              <th>Fleet Type</th>
              <th>Status (off/on)</th>
              <th>Seat Number</th>
              <th>Departure Name</th>
              <th>Registeration Date</th>
              {
                 (position === 1) && <>
                 
                      <th>Edit</th>
                      <th>Delete</th>
                 </>
              }
           </tr>
        </thead>
        <tbody>

        {
           error
           ? <tr><td className='nullError' colSpan={11}>{message}</td></tr>
           : (

            vehicleList.map((item,index)=>{
              const {Vehicle_Id,Plate_Number,Level,Association_Name,Region,Fleet_Name,Status,Seat_Number,Departure_Name,Registeration_Date} = item
               return(
                      <tr key={Plate_Number}>
                        <td >{Plate_Number}</td>
                        <td >{Level}</td>
                        <td >{Association_Name}</td>
                        <td >{Region}</td>
                        <td >{Fleet_Name}</td>
                        <td >{status[Status]}</td>
                        <td >{Seat_Number}</td>
                        <td >{Departure_Name}</td>
                        <td >{Registeration_Date}</td>
                         {
                            (position === 1) && <>
                            
                                  <td ><FaEdit className='editBtn' onClick={()=>updateRecord(Vehicle_Id)}/></td>
                                  <td ><MdDelete className='deleteBtn' onClick={()=>deleteRecord(Plate_Number,Departure_Name)}/></td>
                            </>
                         }
                       
                      </tr>
               )

              })
           )
        }
          </tbody>


          

        </table>
      </div>

    {
      showModal && (
         <div className='updateModal'>
             <div className='modalBg'></div>
            <IoClose className='closeModal' onClick={()=>{setShowModal(false);setUpdateList(true)}} />
            <VehicleCUD {...placeholderData} />
          </div>
      )
    }
      

    </div>
  </>
}

export default ShowVehicleList