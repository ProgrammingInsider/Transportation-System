import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const ShowDepartureList = () => {
  const axiosPrivate = useAxiosPrivate();
  const [departureList, setDepartureList] = useState([]);
  const[error, setError] = useState(false);
  const[message,setMessage] = useState("There no Departure records here.")

  useEffect(()=>{
    const departureListResult = async() => {

      try {

        const resp = await axiosPrivate.get("/departure",{
            Headers:{
                Accept:'application/json'
            }
        })


        const {data} = resp;
        const {result,record, status}= data

        if(status){
          setDepartureList(result)
        }else{
            setError(true)
        }
        
      
        
    } catch (err) {
      // Handle the error
      setError(true)
      if(!err?.response){
        setMessage("Please retry again")
     }else if(err.response?.status === 400){
       setMessage("Missing information")
     }else if(err.response?.status === 401){
       setMessage("Unauthorized")
     }else if(err.response?.status === 403){
       setMessage("Forbidden")
     }else{
       setMessage("Please retry again")
     }

    }

      
  }

    departureListResult();

  },[])

  return <>
  <div className='mainSection'>
<h1 className='mainSectionHeader'>Departure Town</h1>
      <div className='tableContainer'>
        <table>
        <thead>
           <tr>
              <th>Departure Name</th>
           </tr>
        </thead>
        <tbody>

        {
           error
           ? <tr><td className='nullError' colSpan={1}>{message}</td></tr>
           : (

            departureList.map((item)=>{
             
                const {Departure_Id, Departure_Name} = item
             
               return(
                      <tr key={Departure_Id}>
                        <td >{Departure_Name}</td>
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

export default ShowDepartureList