import {useState} from 'react'
import { useNavigate } from 'react-router';
import { useGlobalContext } from '../contextAPI'
import axios from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {setAuth} = useGlobalContext();

  const submitLogin = async(e) => {
    e.preventDefault();
   
  
    if(email !=="" && password !==""){
      
      const insertData = {Email:email,Password:password}
      
      try {

        const resp = await axios.post("/login",insertData,{
            headers:{
                Accept:'application/json'
            },
            withCredentials:true
        }) 



        const {data} = resp;
        const {EmailMatch, PasswordMatch, payload, accessToken}= data

        if(EmailMatch){
            if(PasswordMatch){
                if(accessToken !== null){
                    setAuth({payload,accessToken})
                    setMessage(`Logged In`)
                    navigate("/");
                }else{

                }
            }else{
                setMessage(`Password Incorrect`)
            }
        }else{
          setMessage(`Email Incorrect`)
        }

    
  } catch (err) {
    // Handle the error
    if(!err?.response){
      console.error(!err?.response);
       setMessage("No server Response")
    }else if(err.response?.status === 400){
      setMessage("Missing information")
    }else if(err.response?.status === 401){
      setMessage("Unauthorized")
    }else if(err.response?.status === 403){
      setMessage("Forbidden")
    }else{
      console.error(err);
      setMessage("Fialed")
    }
    
  }

    }else{
      setMessage("Fill all form");
    }
      
  }
  

  return <>
      <div className='formContainer loginElement' onSubmit={submitLogin}>
          <form method='post'>
            <h1 className='formHeader'>Login</h1>
              <span className='errorMessage'>{message}</span>
              <label htmlFor='loginEmail'>
                  <article className='input-name'>Email:</article>
                  <input type='email' id='loginEmail' required className='form-input' onChange={(e)=>setEmail(e.target.value)}/>
              </label>
              <label htmlFor='loginPassword'>
                <article className='input-name'>Password:</article>
                  <input type='password' id='loginPassword' required className='form-input' onChange={(e)=>setPassword(e.target.value)}/>
              </label>
              <input type='submit' value="Submit" className='form-btn form-input'/>
            </form>
      </div>
        
  
  </>
}

export default Login