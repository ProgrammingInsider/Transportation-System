import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const EmployeeCUD = ({Id,fname,lname,pnumber,pass,rePass,departure,formType}) => {
    const axiosPrivate = useAxiosPrivate();
    const[firsName, setFirstName] = useState(fname);
    const[lastName, setLastName] = useState(lname);
    const[phoneNumber, setPhoneNumber] = useState(pnumber);
    const[password, setPassword] = useState(pass);
    const[rePassword, setRePassword] = useState(rePass);
    const [departureTown, setDepartureTown] = useState(departure);
    const [departureName, setDepartureName] = useState([]);
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

    const registerAgent = async(e) => {
        e.preventDefault();
        if(password === rePassword){
            if(firsName !== "" && lastName !== "" && phoneNumber !== 0 && password !== 0 && departureTown !== "" && rePassword !== ""){
                
            const insertEmployee = {First_Name:firsName,Last_Name:lastName,Phone_Number:phoneNumber,Departure_Name:departureTown,Password:password}

            try{
                const {data} = await axiosPrivate.post("/agent",insertEmployee,{
                    Headers:{
                        Accept:'application/json'
                    }
                })
            
                const {isRegistered, Message} = await data

                if(isRegistered){
                    setShowMessage(true)
                     setMessage(Message);
                     setFirstName("");
                     setLastName("");
                     setPhoneNumber("");
                     setPassword("");
                     setRePassword("");
                     setDepartureTown("");
                   }else{
                    setShowMessage(true)
                    setMessage(Message);
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
        }else{
            setShowMessage(true)
            setMessage("Password Does not match");
        }
        
    }

    const updateAgentRecord = async(e) => {
        e.preventDefault();
        
        if(password === rePassword){
            if(firsName !== "" && lastName !== "" && phoneNumber !== 0 && password !== 0 && departureTown !== "" && rePassword !== ""){
                
                const insertEmployee = {Agent_Id:Id,First_Name:firsName,Last_Name:lastName,Phone_Number:phoneNumber,Departure_Name:departureTown,Password:password}

                try {

                    const {data} = await axiosPrivate.put("/agent",insertEmployee,{
                        Headers:{
                            Accept:'application/json'
                        }
                    })
            
                    const {updatedData,Message,changedRows} = data

                    if(updatedData){
                        if(changedRows){
                         setShowMessage(true)
                         setMessage(Message);
                         setFirstName("");
                         setLastName("");
                         setPhoneNumber("");
                         setPassword("");
                         setRePassword("");
                         setDepartureTown("");
          
                        }else{
                          setShowMessage(true)
                          setMessage("You did not change anything");
          
                        }
                      }else{
                        setShowMessage(true)
                        setMessage(Message);
                        setFirstName("");
                        setLastName("");
                        setPhoneNumber("");
                        setPassword("");
                        setRePassword("");
                        setDepartureTown("");
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
        }else{
            setShowMessage(true)
            setMessage("Password Does not match");
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
                        ?<h1 className='formHeader'>Update Employee</h1>
                        :<h1 className='formHeader'>Add Employee</h1>
                    }

                    {
                        showMessage && (<span className='errorMessage'>{message}</span>)
                    }

        <div className='inputContainer'>
            <div className='inputLeft'>
                <label htmlFor='employeeFirstName'>
                    <article className='input-name'>First Name:</article>
                    <input type='text' id='employeeFirstName' required className='form-input' value={firsName} onChange={(e)=>setFirstName(e.target.value)}/>
                </label>

                <label htmlFor='employeeLastName'>
                    <article className='input-name'>Last Name:</article>
                    <input type='text' id='employeeLastName' required className='form-input' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                </label>

                <label htmlFor='employeePhoneNumber'>
                    <article className='input-name'>Phone Number:</article>
                    <input type='text' id='employeePhoneNumber' required className='form-input' value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/>
                </label>

            </div>
            <div className='inputRight'>
                <div className='departureDropDown form-input-dropDown'>
                <label htmlFor='departureTown'>
                    <article className='input-name'>Departure Name:</article>
                    <select name="departure" id="departureTown" className='form-input dropDowns' value={departureTown} onChange={(e)=>setDepartureTown(e.target.value)} required>
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

                <label htmlFor='employeePassword'>
                    <article className='input-name'>Password:</article>
                    <input type='password' id='employeePassword' required className='form-input' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </label>

                <label htmlFor='employeeRePassword'>
                    <article className='input-name'>Confirm Password:</article>
                    <input type='password' id='employeeRePassword' required className='form-input' value={rePassword} onChange={(e)=>setRePassword(e.target.value)}/>
                </label>       
            </div>
        </div>
              
                    { showEditButton 
                         ? (<input type='submit' value="Update" className='form-btn form-input' onClick={updateAgentRecord}/>)
                         : ( <input type='submit' value="Submit" className='form-btn form-input' onClick={registerAgent}/>)
                    }

            </form>
      </div>
  
  </>
}

export default EmployeeCUD