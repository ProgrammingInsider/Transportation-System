import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const FleettypeForm = () => {
    const axiosPrivate = useAxiosPrivate();
    const[fleetName, setFleetName] = useState("");
    const[seatNumber, setSeatNumber] = useState(0);
    const[message, setMessage] = useState("");
    const [showMessage,setShowMessage] = useState(false);

    useEffect(()=>{
         setTimeout(()=>{
               setShowMessage(false)
         },4000)
 
         return ()=>clearTimeout();
    },[showMessage])

    const registerFleetType = async(e) => {
        e.preventDefault();
        if(fleetName !== "" && seatNumber !== 0){
             const insertFleetType = {"Fleet_Name": fleetName,"Seat_Number":parseInt(seatNumber)}

             try{
                const {data} = await axiosPrivate.post("/fleettype",insertFleetType,{
                    Headers:{
                        Accept:'application/json'
                    }
                })
            
                const {isRegistered, Message} = await data

                if(isRegistered){
                    setShowMessage(true);
                  setMessage(Message);
                  setFleetName("")
                  setSeatNumber("")
                }else{
                    setShowMessage(true);
                    setMessage(Message);
                }

        
            }catch (err) {
                // Handle the error
                setShowMessage(true);
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
            setShowMessage(true);
            setMessage("Please fill the form");
        }
    }

  return <>
  <div className='formContainer' onSubmit={registerFleetType}>
          <form method='post'>
              <h1 className='formHeader'>Add Fleet Type</h1>
                {
                    showMessage && (<span className='errorMessage'>{message}</span>)
                }

              <label htmlFor='fleetName'>
                  <article className='input-name'>Fleet Name:</article>
                  <input type='text' id='fleetName' required className='form-input' value={fleetName} onChange={(e)=>setFleetName(e.target.value)}/>
              </label>

              <label htmlFor='seatNumber'>
                  <article className='input-name'>Seat Number:</article>
                  <input type='number' min={0} id='seatNumber' required className='form-input' value={seatNumber} onChange={(e)=>setSeatNumber(e.target.value)}/>
              </label>
             
              <input type='submit' value="Submit" className='form-btn form-input'/>

            </form>
      </div>
  
  </>
}

export default FleettypeForm