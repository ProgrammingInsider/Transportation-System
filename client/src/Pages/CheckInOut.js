import {useEffect, useState, useReducer} from 'react'
import useAxiosPrivate from '../Hooks/useAxiosPrivate'
import { useGlobalContext } from '../contextAPI';

// REDUCER
import { CheckInListReducer } from '../Reducer/CheckInListReducer';

// INTIAL STATE
const initialState = [
    // your initial state here
];

const CheckInOut = () => {
    const axiosPrivate = useAxiosPrivate();
    const{departureLocation,setDepartureLocation} = useGlobalContext();

    // REDUCER
    const[checkInList,dispatch] = useReducer(CheckInListReducer,initialState)

    // USESTATE
    const[showCheckInForm, setshowCheckInForm] = useState(false)
    const[showTotalQueue, setShowTotalQueue] = useState(false)
    const[error,setError]=useState(false)
    const[alldeparture, setAllDepartureName] = useState([])
    const[alldestination, setallDestination] = useState([])
    const[allPlatenumber, setallPlatenumber] = useState([])
    // const[checkInList, setCheckInList] = useState([])
    const[destinationLocation, setDestinationLocation] = useState("")
    const[filterBy, setFilterBy] = useState("")
    const[platenumber, setPlateNumber] = useState("")
    const[message,setMessage] = useState();
    const[checkInAlert,setCheckInAlert] = useState("")
    const[reset,setReset] = useState(false)
    const[queue,setQueue] = useState()
    const[queueInfo,setQueueInfo] = useState(false);
    const[totalQueue, setTotalQueue] = useState("");
    const[submitId, setSubmitId] = useState("");
    const[cancelId, setCancelId] = useState("");
    const[refreshCheckIn, setRefreshCheckIn] = useState(false);


    const Today = (existDate) => {
        // Example date to check
        var dateToCheck = new Date(existDate);

        // Get the current date without the time part
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

        // Set the dateToCheck time to midnight as well
        dateToCheck.setHours(0, 0, 0, 0);

        // Check if the dates are equal
        var isToday = dateToCheck.getTime() === currentDate.getTime();
       
        if (isToday) {
            return true
        } else {
            return false
        }
    }
    
        useEffect(()=>{
            const getPlateNumber = async() => {

                try {

                    const resp = await axiosPrivate.get(`/platenumbers?Departure_Name=${departureLocation}`,{
                        Headers:{
                            Accept:'application/json'
                        }
                    })
            
            
                    const {data} = resp;
                    const {result}= data
                    setallPlatenumber(result)
                    
                } catch (error) {
                // Handle the error
                console.error('Error fetching data:', error);
                }

            }
                    
                    getPlateNumber();

            },[departureLocation])

            useEffect(()=>{
                const getDepartureName = async() => {

                    try {

                        const resp = await axiosPrivate.get("/departure",{
                            Headers:{
                                Accept:'application/json'
                            }
                        })
                
                
                        const {data} = resp;
                        const {result}= data
                        setAllDepartureName(result)
                        
                    } catch (error) {
                    // Handle the error
                    console.error('Error fetching data:', error);
                    }

                }
                        
                        getDepartureName();
            
                },[])

        useEffect(()=>{
            const getArrival= async() => {
    
                try {
    
                    const resp = await axiosPrivate.get(`/arrival/search?Departure_Location=${departureLocation}`,{
                        Headers:{
                            Accept:'application/json'
                        }
                    })
            
            
                    const {data} = resp;
                    const {result}= data
                    
                    setallDestination(result)
                    setFilterBy(result[0]?.Arrival_Location)
                } catch (error) {
                  // Handle the error
                  console.error('Error fetching data:', error);
                }
    
            }
                    
            getArrival();
        
            },[departureLocation, reset, showTotalQueue])
 

        useEffect(()=>{
            const checkIn = async() => {
        
              try {
                
                if(filterBy !== "" && filterBy !== undefined){
                    const resp = await axiosPrivate.get(`/checkin/search?Destination=${filterBy}`,{
                        Headers:{
                            Accept:'application/json'
                        }
                    })
                    const {data} = resp;
                    const {length, result}= data
                     
                    if(parseInt(length)){
    
                        setError(false)
                        dispatch({type:"FETCH", payload:result})
                        // setCheckInList(result)
                        setTotalQueue(length);
                    }else{
                        setMessage(`There is no Queued vehicle(s) from this destination`)
                        setError(true)
                        setTotalQueue(0)
                    }
                }
        
        
                
            } catch (err) {
              // Handle the error
                    setError(true)
                    if(!err?.response){
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
        
             checkIn();
        
          },[filterBy, refreshCheckIn])

          const handleCheckIn = async(e) => {
              e.preventDefault();
              
              const plateNumberExist = allPlatenumber.some(item=>item.Plate_Number === platenumber)
              
              if(plateNumberExist){
                  if(!departureLocation || !destinationLocation){
                      setCheckInAlert("Please Insert valid departure and destination")
                    }else{
                        const checkInData = {Plate_Number:platenumber,Departure:departureLocation,Destination:destinationLocation}

                        // const payload = 
                        try {
    
                            const resp = await axiosPrivate.post(`/checkin`,checkInData,{
                                Headers:{
                                    Accept:'application/json'
                                }
                            })
                    
                            
                            const {data} = resp;
                            const {success,queue_position,message} = data;
                            
                            if(success){
                               dispatch({type:"ADD", payload:{
                                 Plate_Number:platenumber,
                                 Departure:departureLocation,
                                 Destination:destinationLocation,
                                 check_in_time: "Today",
                                 check_out_time:"Queued",
                                 queue_position:queue_position}
                            })

                                setCheckInAlert(message)
                                setQueue(queue_position)
                                setQueueInfo(true)
                            }else{
                                setCheckInAlert(message)
                            }
                            
                        } catch (error) {
                          // Handle the error
                          console.error('Error fetching data:', error);
                        }
                  }
              }else{
                  setCheckInAlert("Please choose the valid Plate Number")
              }
          }

          const handleSubmit = async(platenumber) => {
            let text = `Are you sure you want to Check out a Vehicle with ${platenumber} plate number`;
            // alert(Id)

            if(!submitId){
                 console.log("Please Select Valid Id");
            }else{
                if (window.confirm(text) == true) {
                    try {
    
    
                        const resp = await axiosPrivate.put(`/checkout/update?Id=${submitId}&checkOut=submit`,{
                            Headers:{
                                Accept:'application/json'
                            }
                        })
                
                
                        const {data} = resp;
                        const {success,Message} = data
        
                        if(success){
                           dispatch({type:"SUBMIT", id:submitId})
                           setSubmitId("");
                        }
                      
                    } catch (error) {
                      // Handle the error
                      console.error('Error fetching data:', error);
                    }
                 
              }
            }
            
        }

          const handleCancel = async(platenumber) => {
            //   alert(Id)
            
            let text = `Are you sure you want to cancel Check out of a Vehicle with ${platenumber} plate number`;
            if(!cancelId){
                console.log("Please Select Valid Id");

            }else{
                if (window.confirm(text) == true) {
                    try {
    
                        const resp = await axiosPrivate.put(`/checkout/update?Id=${cancelId}&checkOut=cancel`,{
                            Headers:{
                                Accept:'application/json'
                            }
                        })
                
                
                        const {data} = resp;
                        const {success,Message} = data
        
                        if(success){
                            dispatch({type:"CANCEL", id:cancelId})
                            setCancelId("");
                        }
                      
                    } catch (error) {
                      // Handle the error
                      console.error('Error fetching data:', error);
                    }
                 
              }
            }
           
        }

        const handleReset = async(departureLocation) => {
            let text = `Are you sure you want to reset all queue position for ${departureLocation} departure`;
            if (window.confirm(text) == true) {
                try {


                    const resp = await axiosPrivate.put(`/resetqueue?Departure_Name=${departureLocation}`,{
                        Headers:{
                            Accept:'application/json'
                        }
                    })
            
            
                    const {data} = resp;
                    const {success,Message} = data
    
                    if(success){
                        setReset(!reset);
                    }
                  
                } catch (error) {
                  // Handle the error
                  console.error('Error fetching data:', error);
                }
             
          }
        }


  return (
    <>
    <div className='sectionHeader'>
       {/* <input type='submit' value="Submit" /> */}
       <button className='form-btn form-input' style={{"width":"150px"}} onClick={()=>setshowCheckInForm(true)}>Add Check-In</button>

        <div className='totalQueueContainer'>
            <button className='form-btn form-input' style={{"width":"150px"}} onClick={()=>setShowTotalQueue(!showTotalQueue)}>Queue Position</button>

           {
            showTotalQueue && (
                <div className='totalQueue'>
                <table>
                    <thead>
                       <tr>
                           <th>Destination</th>
                           <th>Total Queue</th>
                       </tr>
                    </thead>
                    <tbody>
                       {
                          alldestination.map((item,index)=>{
                              const {Arrival_Id, Arrival_Location,Total_Queue} = item
                              return (
                                <tr key={Arrival_Id}>
                                    <td >{Arrival_Location}</td>
                                    <td >{Total_Queue}</td>
                                </tr>
                          )})
                          }
                        
                    </tbody>
                </table>
                <button className='form-btn form-input reset-btn'onClick={()=>handleReset(departureLocation)}>Reset Total Queue</button>
            </div>
            )
           }
        </div> 
    </div>

      <div className='mainSection'>
     {/* Filter BY */}
     <div className='filterBy'>
        <span>Filter By:</span>
        <div className='departureDropDown form-input-dropDown'>
                    <label htmlFor='destinationLocation'>
                
                      <select name="departure" id="destinationLocation" className='form-input dropDowns' value={filterBy} onChange={(e)=>setFilterBy(e.target.value)}>
    
                          {
                          alldestination.map((item,index)=>{
                              const {Arrival_Id, Arrival_Location} = item
                              return (
                                  <option key={Arrival_Id} value={Arrival_Location}>{Arrival_Location}</option>
                              )
                          })
                          }
                          
                      </select>
                    </label>
        </div>
        <span className='totalQueueByDestination'>Total: {totalQueue}</span>
     </div>
     
      <h1 className='mainSectionHeader'>Queued vehicle(s) for {filterBy} Destination</h1>
      <div className='tableContainer'>
        <table>
        <thead>
           <tr>
              <th>Plate Number</th>
              <th>Departure</th>
              <th>Destination</th>
              <th>Check-in-time</th>
              <th>Check-out status</th>
              <th>queue position</th>
              <th>Submit</th>
              <th>Cancel</th>

           </tr>
        </thead>
        <tbody>

        {
           (error || checkInList.length <= 0)
           ? <tr><td className='nullError' colSpan={10}>{message}</td></tr>
           : (

            checkInList.map((item)=>{
                 
                const {Id,Plate_Number,Departure,Destination,check_in_time,check_out_time,queue_position} = item

               return(
                      <tr key={Id}>
                        <td >{Plate_Number}</td>
                        <td >{Departure}</td>
                        <td >{Destination}</td>
                        <td >{Today(check_in_time) ? "Today" :check_in_time}</td>
                        <td className='Queued'>{check_out_time}</td>
                        <td className='queuePosition'>{queue_position}</td>
                        <td>
                            <span className='submitCheckOut' onClick={()=>{handleSubmit(Plate_Number);setSubmitId(prev=> {return Id})}}>Submit</span>
                        </td>
                        <td>
                            <span className='submitCheckOut cancelCheckOut'onClick={()=>{handleCancel(Plate_Number);setCancelId(prev=> {return Id})}}>Cancel</span>
                        </td>
                       
                      </tr>
               )

              })
           )
        }
          </tbody>

        </table>
      </div>
     
      </div>
    {
        departureLocation || (
        <div className='formContainer overlayDepartureContainer'>
            <div className='departureDropDown form-input-dropDown entranceDropDown'>
                    <label htmlFor='departureLocation'>
                        <article className='input-name'>Departure Location:</article>
                      <select name="departure" id="departureLocation" className='form-input dropDowns' value={departureLocation} onChange={(e)=>setDepartureLocation(e.target.value)}>
                          <option value="">Select Departure Town</option>
                          {
                          alldeparture.map((item,index)=>{
                              const {Departure_Id, Departure_Name} = item
                              return (
                                  <option key={Departure_Id} value={Departure_Name}>{Departure_Name}</option>
                              )
                          })
                          }
                          
                      </select>
                    </label>

              </div>
        </div>
        )
    }
    
     {
        showCheckInForm && (
     <div className='formContainer overlayContainer'>
        <span className='hideOverlay' onClick={()=>{setshowCheckInForm(false);setRefreshCheckIn(!refreshCheckIn)}}>close</span>
       <form onSubmit={handleCheckIn} className='checkInForm'>
       

                <div className={queueInfo?'queueInfo showQueueInfo':'queueInfo hideQueueInfo'}>
                <span className='hideOverlay' onClick={()=>{setQueueInfo(false);setPlateNumber("")}}>close</span>
                    <p>Plate Number : {platenumber}</p>
                    <p>Departure : {departureLocation}</p>
                    <p>Destination : {destinationLocation}</p>
                    <p>Queue Position : {queue}</p>
                </div>
           
            <span>{checkInAlert}</span>
            <label htmlFor="departurename">Departure:</label>
            <input type="text" id="departurename" className='form-input'  value={departureLocation} disabled required/>

            <div className='departureDropDown form-input-dropDown'>
                <label htmlFor="platenumber">Plate Number:</label>
                <input list="PlateNumbers" id="platenumber" name="browser" className='form-input'  value={platenumber} onChange={(e)=>setPlateNumber(e.target.value)} />

                <datalist id="PlateNumbers">
                {
                    allPlatenumber.map((item,index)=>{
                        return (
                            <option key={index} value={item.Plate_Number} />
                        )
                    })
                }    
                </datalist>
            </div>

                  <div className='departureDropDown form-input-dropDown'>
                    <label htmlFor='destinationLocation'>
                        <article className='input-name'>Destination:</article>
                      <select name="departure" id="destinationLocation" className='form-input dropDowns' value={destinationLocation} onChange={(e)=>setDestinationLocation(e.target.value)}>
                          <option value="">Select Destination</option>
                          {
                          alldestination.map((item,index)=>{
                              const {Arrival_Id, Arrival_Location} = item
                              return (
                                  <option key={Arrival_Id} value={Arrival_Location}>{Arrival_Location}</option>
                              )
                          })
                          }
                          
                      </select>
                    </label>
                    </div>
                  <input type='submit' value="Submit" className='form-btn form-input'/>
       </form>
    </div>
        )
     }
    </>
  )
}

export default CheckInOut