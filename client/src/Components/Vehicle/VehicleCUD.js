import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const VehicleCUD = ({VehicleId,P_plateNumber,P_level,P_associationName,P_region,P_fleetName,P_status,P_seatNumber,P_departureName,formType}) => {
    const axiosPrivate = useAxiosPrivate();
    const [vehicle_Id,setvehicle_Id] = useState(VehicleId);
   const [plateNumber,setPlateNumber] = useState(P_plateNumber);
   const [level,setLevel] = useState(P_level);
   const [associationName,setAssociationName] = useState(P_associationName);
   const [region,setRegion] = useState(P_region);
   const [fleetName,setFleetName] = useState(P_fleetName);
   const [fleetType,setFleetType] = useState([]);
   const [status,setStatus] = useState(P_status);
   const [seatNumber,setSeatNumber] = useState(P_seatNumber);
   const [departureName,setDepartureName] = useState(P_departureName);
   const [departureTown,setDepartureTown] = useState([]);
   const [message,setMessage] = useState("");
   const [showEditButton,setShowEditButton] = useState(false);
   const [showMessage,setShowMessage] = useState(false);

   useEffect(()=>{
        setTimeout(()=>{
              setShowMessage(false)
        },4000)

        return ()=>clearTimeout();
   },[showMessage])

   useEffect(()=>{
       if(formType==="Update"){
          setShowEditButton(true);
       }
   },[])


   
   const registerVehicle = async(e) => {
    e.preventDefault();
    
    if(plateNumber !== "" && associationName !== "" && level !== 0  && region !== "" && fleetName !== "" && seatNumber !== 0 && departureName !== ""){
     
            const insertVehicle = {Plate_Number:plateNumber,Level:parseInt(level),Association_Name:associationName,Region:region,Fleet_Name:fleetName,Status:parseInt(status),Seat_Number:parseInt(seatNumber),Departure_Name:departureName}

            try{
                const {data} = await axiosPrivate.post("/vehicle",insertVehicle,{
                    Headers:{
                        Accept:'application/json'
                    }
                })
            
                const {isRegistered, Message} = await data
                if(isRegistered){
                    setShowMessage(true)
                    setMessage(Message);
                    setPlateNumber("")
                    setLevel("")
                    setAssociationName("")
                    setRegion("")
                    setFleetName("")
                    setDepartureName("")
                    setSeatNumber(0)
          
                  }else{
                      setShowMessage(true)
                      setMessage(Message);
                  }
            
                return {isRegistered, Message};
        
            }catch (err) {
                // Handle the error
                setShowMessage(true)
                if(!err?.response){
                    setMessage("Registeration Fialed")
                 }else if(err.response?.status === 400){
                   setMessage("Missing information")
                 }else if(err.response?.status === 401){
                   setMessage("Unauthorized")
                 }else if(err.response?.status === 403){
                   setMessage("Forbidden")
                 }else{
                   setMessage("Registeration Fialed")
                 }
              }
        
    }else{
        setShowMessage(true)
        setMessage("Please fill the form");
    }
 }



 const updateVehicleRecord = async(e) => {
    e.preventDefault();
    
    if(plateNumber !== "" && associationName !== "" && level !== 0  && region !== "" && fleetName !== "" && seatNumber !== 0 && departureName !== ""){
     
        
        
            const updateRecord = {Vehicle_Id:vehicle_Id,Plate_Number:plateNumber,Level:parseInt(level),Association_Name:associationName,Region:region,Fleet_Name:fleetName,Status:parseInt(status),Seat_Number:parseInt(seatNumber),Departure_Name:departureName}
            
            try {

                const {data} = await axiosPrivate.put("/vehicle",updateRecord,{
                    Headers:{
                        Accept:'application/json'
                    }
                })
        
                const {updatedData,Message,changedRows} = data
                if(updatedData){
                    if(changedRows){
                        setShowMessage(true)
                        setMessage(Message);
                        setPlateNumber("")
                        setLevel("")
                        setAssociationName("")
                        setRegion("")
                        setFleetName("")
                        setDepartureName("")
                        setSeatNumber(0)
                    }else{
                        setShowMessage(true)
                        setMessage("You did not make any change");
                    }
        
                }else{
                    setShowMessage(true)
                    setMessage(Message);
                    setMessage(Message);
                }
                
            } catch (err) {
              // Handle the error
              setShowMessage(true)
              if(!err?.response){
                setMessage("Update Fialed")
             }else if(err.response?.status === 400){
               setMessage("Missing information")
             }else if(err.response?.status === 401){
               setMessage("Unauthorized")
             }else if(err.response?.status === 403){
               setMessage("Forbidden")
             }else{
               setMessage("Update Fialed")
             }
            }
                    
    }else{
        setShowMessage(true);
        setMessage("Please fill the form");
    }
 }


useEffect(()=>{
    fleetType.map((item,index)=>{
      const {Fleet_Name, Seat_Number} = item;
      if(Fleet_Name === fleetName){
          setSeatNumber(Seat_Number)
      }
      
    })
          
  },[fleetName])

 useEffect(()=>{
  const getDepartureTown = async() => {

    try {

        const resp = await axiosPrivate.get("/departure",{
            Headers:{
                Accept:'application/json'
            }
        })


        const {data} = resp;
        const {result,record, status}= data
        setDepartureTown(result)
        
    } catch (error) {
      // Handle the error
      console.error('Error fetching data:', error);
    }

    }          
          getDepartureTown();

  },[])

  useEffect(()=>{
    const getFleetTypeResult = async() => {
        try {

            const resp = await axiosPrivate.get("/fleettype",{
                Headers:{
                    Accept:'application/json'
                }
            })
    
    
            const {data} = resp;
            const {result,record, status}= data
            setFleetType(result)
            
        } catch (error) {
          // Handle the error
          console.error('Error fetching data:', error);
        }
    }
            
            getFleetTypeResult();

    },[])

        return <>
        <div className='formContainer'>
                <form>
                {
                        showEditButton 
                        ? (<h1 className='formHeader'>Update Vehicle</h1>)
                        :
                        (<h1 className='formHeader'>Add Vehicle</h1>)
                    }
                    
                    {
                        showMessage && (<span className='errorMessage'>{message}</span>)
                    }
                <div className='inputContainer'>
                    <div className='inputLeft'>

                    <label htmlFor='plateNumber'>
                        <article className='input-name'>Plate Number:</article>
                        <input type='number' min={0} id='plateNumber' required className='form-input' value={plateNumber} onChange={(e)=>setPlateNumber(e.target.value)}/>
                    </label>

                    <label htmlFor='level'>
                        <article className='input-name'>Level:</article>
                        <input type='number' min={0} id='level' required className='form-input' value={level} onChange={(e)=>setLevel(e.target.value)}/>
                    </label>

                    <label htmlFor='associationName'>
                        <article className='input-name'>Association Name:</article>
                        <input type='text' id='associationName' required className='form-input' value={associationName} onChange={(e)=>setAssociationName(e.target.value)}/>
                    </label>

                    <label htmlFor='region'>
                        <article className='input-name'>Region:</article>
                        <input type='text' id='region' required className='form-input' value={region} onChange={(e)=>setRegion(e.target.value)}/>
                    </label>

                    </div>

                    <div className='inputRight'>
                        <div className='departureDropDown form-input-dropDown'>
                        <label htmlFor='fleetName'>
                            <article className='input-name'>Fleet Type:</article>
                            <select name="fleetName" id="fleetName" className='form-input dropDowns' value={fleetName} onChange={(e)=>setFleetName(e.target.value)} required>
                                <option value="">Select Fleet Type</option>
                                {
                                fleetType.map((item,index)=>{
                                
                                    const {Fleet_Id,Fleet_Name,Seat_Number} = item
                                    return (
                                        <option key={Fleet_Id} value={Fleet_Name}>{Fleet_Name}</option>
                                    )
                                })
                                }
                                
                            </select>
                        </label>
                        </div>

                        <div className='vehicleStatus form-input-dropDown'>
                        <label htmlFor='vehicleStatus'>
                            <article className='input-name'>Status (off/on):</article>
                            <select name="status" id="vehicleStatus" className='form-input dropDowns' value={status} onChange={(e)=>setStatus(e.target.value)} required>
                                <option value={1}>Active</option> 
                                <option value={0}>Inactive</option> 
                            </select>
                        </label>
                        </div>

                        <label htmlFor='seatNumber'>
                            <article className='input-name'>Seat Number:</article>
                            <input type='number' id='seatNumber' required className='form-input' value={seatNumber} onChange={(e)=>setSeatNumber(e.target.value)} disabled/>
                        </label>


                        <div className='departureDropDown form-input-dropDown'>
                        <label htmlFor='departureTown'>
                            <article className='input-name'>Departure Name:</article>
                            <select name="departure" id="departureTown" className='form-input dropDowns' value={departureName} onChange={(e)=>setDepartureName(e.target.value)} required>
                                <option value="">Select Departure Town</option>
                                {
                                departureTown.map((item,index)=>{
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

                </div>

                    
                    {
                        showEditButton 
                        ? (<input type='submit' value="Update" className='form-btn form-input' onClick={updateVehicleRecord}/>
                                                    )
                        :
                        (<input type='submit' value="Submit" className='form-btn form-input' onClick={registerVehicle}/>
                                                    )
                    }
                    

                </form>
            </div>

        </>

}

export default VehicleCUD