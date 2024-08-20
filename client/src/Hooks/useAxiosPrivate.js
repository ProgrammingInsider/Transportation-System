import {useEffect} from 'react'
import { axiosPrivate } from '../api/axios'
import useRefreshToken from './useRefreshToken'
import { useGlobalContext } from '../contextAPI'

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const {auth} = useGlobalContext();

    useEffect(()=>{

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config=>{
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`
                }

                return config;
            },

            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response=>response,
            async(error)=>{
                const prevRequest = error?.config;

                if(error?.response?.status === 403 && !prevRequest?.sent){
                    prevRequest.sent = true;

                    const {accessToken} = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    
                    return axiosPrivate(prevRequest);
                }

                return Promise.reject(error);
            }
        );

        return ()=>{
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    },[auth, refresh])
  
    return axiosPrivate;
}

export default useAxiosPrivate