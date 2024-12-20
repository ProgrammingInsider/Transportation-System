import axios from "../api/axios"
import { useGlobalContext } from "../contextAPI"

const useLogout = () => {
    const {setAuth} = useGlobalContext();

    const logout = async () => {
        setAuth({})

        try{
           const response = await axios('/logout',{
                withCredentials:true
           });
        }catch(err){
            console.error(err);
        }
    }
  return logout;
}

export default useLogout