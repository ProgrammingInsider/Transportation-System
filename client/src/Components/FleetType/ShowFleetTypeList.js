import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const ShowFleetTypeList = () => {
  const axiosPrivate = useAxiosPrivate();
    const [fleetTypeList, setFleetTypeList] = useState([]);
    const[error, setError] = useState(false);
    const[message,setMessage] = useState("There no Fleet Type records here.")

  useEffect(()=>{
    const fleetTypeListResult = async() => {

      try {

        const resp = await axiosPrivate.get("/fleettype",{
            Headers:{
                Accept:'application/json'
            }
        })


        const {data} = resp;
        const {result,record, status}= data

        if(status){
          setFleetTypeList(result)
        }else{
            setError(true)
        } 
        
    } catch (err) {
      // Handle the error
      setError(true)
      if(!err?.response){
        setMessage("No server Response")
     }else if(err.response?.status === 400){
       setMessage("Missing information")
     }else if(err.response?.status === 401){
       setMessage("Unauthorized")
     }else if(err.response?.status === 403){
       setMessage("Forbidden")
     }else{
       setMessage("Fialed")
     }
    }
}

    fleetTypeListResult();

  },[])


  return <>
  <div className='mainSection'>
<h1 className='mainSectionHeader'>Fleet Type</h1>
      <div className='tableContainer'>
        <table>
        <thead>
           <tr>
              <th>Fleet Name</th>
              <th>Seat Number</th>
           </tr>
        </thead>
        <tbody>

        {
           error
           ? <tr><td className='nullError' colSpan={2}>{message}</td></tr>
           : (

            fleetTypeList.map((item,index)=>{
             
                
                const {Fleet_Id,Fleet_Name,Seat_Number} = item
             
               return(
                      <tr key={Fleet_Id}>
                        <td >{Fleet_Name}</td>
                        <td >{Seat_Number}</td>
                      </tr>
               )

              })
           )
        }
          </tbody>

        </table>
      </div>
      </div>
  </>
}

export default ShowFleetTypeList