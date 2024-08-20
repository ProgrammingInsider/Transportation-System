import axios from "../api/axios"
import { useGlobalContext } from "../contextAPI";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
    const {setAuth} = useGlobalContext();
    const navigate = useNavigate();
    const refresh = async () => {
      
          try{
              const response = await axios.get('/refresh',{
                withCredentials:true
              });
        
            setAuth(prev=>{
                return response.data;
            })
            
            return response.data;

          }catch(err){
            setAuth({})
            navigate("/login");
          }
  }
  return refresh
}

export default useRefreshToken;