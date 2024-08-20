import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const ArrivalCUD = ({Id,departure,arrival,km,formType}) => {
    const axiosPrivate = useAxiosPrivate();
    const[departureLocation, setDepartureLocation] = useState(departure);
    const[arrivalLocation, setArrivalLocation] = useState(arrival);
    const [departureName, setDepartureName] = useState([]);
    const[distance, setDistance] = useState(km);
    const[message, setMessage] = useState("");

    const [showMessage,setShowMessage] = useState(false);
    const [showEditButton,setShowEditButton] = useState(false);

    useEffect(()=>{
        if(formType==="Update"){
           setShowEditButton(true);
        }
    },[])
 
    useEffect(()=>{
         setTimeout(()=>{
               setShowMessage(false)
         },4000)
 
         return ()=>clearTimeout();
    },[showMessage])

    const registerArrivalLocation = async(e) => {
        e.preventDefault();
        if(departureLocation !== "" && arrivalLocation !== "" && distance !== 0){
           
             const insertArrival = {Departure_Location: departureLocation,Arrival_Location:arrivalLocation, Distance:parseFloat(distance)}

             try{
                const {data} = await axiosPrivate.post("/arrival",insertArrival,{
                    Headers:{
                        Accept:'application/json'
                    }
                })
            
                const {isRegistered, Message} = await data

                if(isRegistered){
                    setShowMessage(true)
                    setMessage(Message);
                    setDepartureLocation("")
                    setArrivalLocation("")
                    setDistance(0)
                  }else{
                      setShowMessage(true)
                      setMessage(Message);
                      setDepartureLocation("")
                       setArrivalLocation("")
                       setDistance(0)
                  }
            
        
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

    const updateArrivalRecord = async(e) => {
        e.preventDefault();
        if(departureLocation !== "" && arrivalLocation !== "" && distance !== 0){
           
             const updateRecord = {Arrival_Id:Id,Departure_Location: departureLocation,Arrival_Location:arrivalLocation, Distance:parseFloat(distance)}

             try {

                const {data} = await axiosPrivate.put("/arrivallocation",updateRecord,{
                    Headers:{
                        Accept:'application/json'
                    }
                })
        
                const {updatedData,Message,changedRows} = data
        
                if(updatedData){
                    if(changedRows){
                        setShowMessage(true)
                        setMessage(Message);
                        setDepartureLocation("")
                        setArrivalLocation("")
                        setDistance(0)
      
                    }else{
                      setShowMessage(true)
                      setMessage("You did not change anything");
                     }
     
                 }else{
                     setShowMessage(true)
                     setMessage(Message);
                     setDepartureLocation("")
                      setArrivalLocation("")
                      setDistance(0)
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
            setShowMessage(true)
            setMessage("Please fill the form");
        }
    }


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
        <div className='formContainer'>
                <form method='post'>
                    {
                        showEditButton
                        ?<h1 className='formHeader'>Update Arrival Location</h1>
                        :<h1 className='formHeader'>Add Arrival Location</h1>
                    }

                    {
                        showMessage && (<span className='errorMessage'>{message}</span>)
                    }
                    <div className='departureDropDown form-input-dropDown'>
                    <label htmlFor='departureLocation'>
                        <article className='input-name'>Departure Location:</article>
                      <select name="departure" id="departureLocation" className='form-input dropDowns' value={departureLocation} onChange={(e)=>setDepartureLocation(e.target.value)}>
                          <option value="">Select Departure Town</option>
                          {
                          departureName.map((item,index)=>{
                              const {Departure_Id, Departure_Name} = item
                              return (
                                  <option key={Departure_Id} value={Departure_Name}>{Departure_Name}</option>
                              )
                          })
                          }
                          
                      </select>
                    </label>
                  </div>
      
                    <label htmlFor='arrivalLocation'>
                        <article className='input-name'>Arrival Location:</article>
                        <input type='text' id='arrivalLocation' required className='form-input' value={arrivalLocation} onChange={(e)=>setArrivalLocation(e.target.value)}/>
                    </label>
      
                    <label htmlFor='distance'>
                        <article className='input-name'>Distance:</article>
                        <input type='text' min={0} id='distance' required className='form-input' value={distance} onChange={(e)=>setDistance(e.target.value)}/>
                    </label>
                   
      
                    { showEditButton 
                         ? (<input type='submit' value="Update" className='form-btn form-input' onClick={updateArrivalRecord}/>)
                         : ( <input type='submit' value="Submit" className='form-btn form-input' onClick={registerArrivalLocation}/>)
                    }
                  </form>
            </div>
        
        </>
}

export default ArrivalCUD