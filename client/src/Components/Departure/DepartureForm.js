import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const DepartureForm = () => {
  const axiosPrivate = useAxiosPrivate();
     const[departure, setDeparture] = useState("");
     const[message, setMessage] = useState("");
     const [showMessage,setShowMessage] = useState(false);

     useEffect(()=>{
          setTimeout(()=>{
                setShowMessage(false)
          },4000)
  
          return ()=>clearTimeout();
     },[showMessage])


    const registerDeparture = async(e) => {
        e.preventDefault();
        if(departure !== ""){
             const insertDeparture = {"Departure_Name": departure}

             try{
              const {data} = await axiosPrivate.post("/departure",insertDeparture,{
                  Headers:{
                      Accept:'application/json'
                  }
              })
          
              const {isRegistered, Message} = await data

              if(isRegistered){
                setShowMessage(true);
              setMessage(Message);
              setDeparture("")
            }else{
                setShowMessage(true);
                setMessage(Message);
            }
      
          }catch (err) {
              // Handle the error
            setShowMessage(true);

            if(!err?.response){
              setMessage("Registeration Failed")
           }else if(err.response?.status === 400){
             setMessage("Missing information")
           }else if(err.response?.status === 401){
             setMessage("Unauthorized")
           }else if(err.response?.status === 403){
             setMessage("Forbidden")
           }else{
             setMessage("Registeration Failed")
           }
            }
          
         
        }else{
            setShowMessage(true);
            setMessage("Please fill the form");
        }
    }

  return <>
  <div className='formContainer' onSubmit={registerDeparture}>
          <form method='post'>
              <h1 className='formHeader'>Add Departure</h1>
                {
                    showMessage && (<span className='errorMessage'>{message}</span>)
                }

              <label htmlFor='departureName'>
                  <article className='input-name'>Departure Name:</article>
                  <input type='text' id='departureName' required className='form-input' value={departure} onChange={(e)=>setDeparture(e.target.value)}/>
              </label>
             
              <input type='submit' value="Submit" className='form-btn form-input'/>

            </form>
      </div>
  
  </>
}

export default DepartureForm