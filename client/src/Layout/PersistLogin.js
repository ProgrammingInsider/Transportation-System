import {Outlet} from "react-router-dom"
import { useState, useEffect } from "react"
import useRefreshToken from "../Hooks/useRefreshToken"
import { useGlobalContext } from "../contextAPI"

const PersistLogin = () => {
    const [isLoading,setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth} = useGlobalContext();

    useEffect(()=>{
        const verifyRefreshToken = async () => {
            try{
               await refresh();
            }catch(err){
               console.error(err);
            }finally{
                setIsLoading(false)
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    },[])

    // useEffect(()=>{
    //       console.log(`isLoading: ${isLoading}`);
    //       console.log(`aT:${auth?.accessToken}`);
    // },[isLoading])
  return (
        <>
           {
            isLoading
            ?<p>Loading...</p>
            :<Outlet/>
           }
        </>
  )
}

export default PersistLogin