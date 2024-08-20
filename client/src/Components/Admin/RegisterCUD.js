import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate'

const RegisterCUD = ({Id,fname,lname,adminEmail,adminPosition,formType}) => {
    const axiosPrivate = useAxiosPrivate();


    const [adminId,setAdminId] = useState(Id)
    const [message, setMessage] = useState("")
    const [firstName, setFirstName] = useState(fname)
    const [lastName, setLastName] = useState(lname)
    const [email, setEmail] = useState(adminEmail)
    const [position, setPosition] = useState(adminPosition)
    const [repassword, setRePassword] = useState("")
    const [password, setPassword] = useState("")
    const positionArray = ["Register as Admin","Register as Employee"]
    const [showMessage,setShowMessage] = useState(false);
    const [showEditButton,setShowEditButton] = useState(false);

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
 
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


    const submitRegister = async (e) => {
        e.preventDefault();

        if(password === repassword){
            
            if(firstName !=="" && lastName !=="" && email !=="" && position !=="" && password !=="" && repassword !==""){ 
                
                const insertedData = {Email:email, First_Name:firstName, Last_Name:lastName, Password:repassword, Position:parseInt(position)}

                try{
                    const {data} = await axiosPrivate.post("/admin",insertedData,{
                        Headers:{
                            Accept:'application/json'
                        }
                    })
                
                    const {isRegistered, Message} = await data

                    if(isRegistered){
                        setShowMessage(true)
                         setMessage(Message);
                         setFirstName("")
                         setLastName("")
                         setEmail("")
                         setPosition(1)
                         setRePassword("")
                         setPassword("")
                    }else{
                        setShowMessage(true)
                        setMessage(Message);
                    }
                
                    
            
                }catch (err) {
                    // Handle the error
                   setShowMessage(true)
                    if(!err?.response){
                        setMessage("Registered Failed")
                     }else if(err.response?.status === 400){
                       setMessage("May be this email token please try with another")
                     }else if(err.response?.status === 401){
                       setMessage("Unauthorized")
                     }else if(err.response?.status === 403){
                       setMessage("Forbidden")
                     }else{
                       setMessage("Registered Failed")
                     }
                  }

               
            }else{
                setShowMessage(true)
                setMessage("Please fill all form");
            }

        }else{
            setShowMessage(true)
           setMessage("Password is does not match");
        }
    }

    const updateAdminRecord = async(e) => {
           e.preventDefault(); 

            if(firstName !=="" && lastName !=="" && email !=="" && position !==""){ 
                
                const updateRecord  = {Admin_Id:Id,Email:email, First_Name:firstName, Last_Name:lastName,OldPassword:oldPassword,NewPassword:newPassword,Position:parseInt(position)}

                try {

                    const {data} = await axiosPrivate.put("/admin",updateRecord,{
                        Headers:{
                            Accept:'application/json'
                        }
                    })
            
                    const {updatedData,Message,changedRows} = data

                    if(updatedData){
                        if(changedRows){
                            setShowMessage(true)
                            setMessage(Message);
                            setFirstName("")
                            setLastName("")
                            setEmail("")
                            setPosition(1)
                            setOldPassword("")
                            setNewPassword("")
                        }else{
                            setShowMessage(true)
                            setMessage("You did not change anything");
                        }
                        
                    }else{
                        setShowMessage(true)
                        setMessage(Message);
                    }
            
                    
                } catch (err) {
                  // Handle the error
                   setShowMessage(true)
                    if(!err?.response){
                        setMessage("Update Failed")
                     }else if(err.response?.status === 400){
                       setMessage("May be this email token please try with another")
                     }else if(err.response?.status === 401){
                       setMessage("Unauthorized")
                     }else if(err.response?.status === 403){
                       setMessage("Forbidden")
                     }else{
                       setMessage("Update Failed")
                     }
                }
            
               
                
            }else{
                setShowMessage(true)
                setMessage("Please fill all form");
            }

        }

return <>
    <div className='formContainer'>
        <form method='post'>
         
            { showEditButton 
              ? (<h1 className='formHeader'>Edit Admin</h1>)
              : (<h1 className='formHeader'>Register</h1>)
             }

            {showMessage && (<span className='errorMessage'>{message}</span>)}
            

            <div className='inputContainer'>

              <div className='inputLeft'>
                  <label htmlFor='registerFirstName'>
                      <article className='input-name'>First Name:</article>
                      <input type='text' id='registerFirstName' required className='form-input' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                  </label>
                  <label htmlFor='registerLastName'>
                      <article className='input-name'>Last Name:</article>
                      <input type='text' id='registerLastName' required className='form-input' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                  </label>
                  <label htmlFor='registerEmail'>
                      <article className='input-name'>Email:</article>
                      <input type='email' id='registerEmail' required className='form-input' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                  </label>
              </div>

              <div className='inputRight'>
                      <label htmlFor='registerPosition'>
                      <article className='input-name'>Position:</article>
                      <select name="position" className='dropDowns form-input' value={position} onChange={(e)=>setPosition(e.target.value)}>
                              <option value={1}>{positionArray[0]}</option>
                              <option value={0}>{positionArray[1]}</option>
                      </select>
                  </label>

                  { showEditButton 

                        ? <>
                            <label htmlFor='oldPassword'>
                                <article className='input-name'>Old Password:</article>
                                <input type='password' id='oldPassword' className='form-input' value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                            </label>
                            <label htmlFor='newPassword'>
                                <article className='input-name'>New Password:</article>
                                <input type='password' id='registerConfirmPassword' className='form-input' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                            </label>
                        </>

                        : <>
                            <label htmlFor='registerPassword'>
                                <article className='input-name'>Password:</article>
                                <input type='password' id='registerPassword' required className='form-input' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                            </label>
                            <label htmlFor='registerConfirmPassword'>
                                <article className='input-name'>Confirm Password:</article>
                                <input type='password' id='registerConfirmPassword' required className='form-input' value={repassword} onChange={(e)=>setRePassword(e.target.value)}/>
                            </label>
                        </>
                  }

              </div>
            </div>
            
            { showEditButton 
              ? (<input type='submit' value="Update" className='form-btn form-input' onClick={updateAdminRecord}/>)
              : ( <input type='submit' value="Submit" className='form-btn form-input' onClick={submitRegister}/>)
             }

          </form>
    </div>
</>
}

export default RegisterCUD