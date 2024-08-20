import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate.js';

// ICONS
import { IoClose } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

// COMPONENTSs
import ArrivalCUD from './ArrivalCUD.js';
import {useGlobalContext} from '../../contextAPI.js'


const ShowArrivalList = () => {
  const axiosPrivate = useAxiosPrivate();
  const {auth} = useGlobalContext();
  const [arrivalLocationList, setArrivalLocationList] = useState([]);
  const[error, setError] = useState(false);
  const [placeholderData, setPlaceholderData] = useState();  
  const[showModal, setShowModal] = useState(false);
  const[updateList, setUpdateList] = useState(false);
  const [message,setMessage] = useState("There no Arrival Location records here.")
  
  const position = auth?.payload?.Position;

    

    useEffect(()=>{
        const arrivalLocationListResult = async() => {

          try {

            const resp = await axiosPrivate.get("/arrival",{
                Headers:{
                    Accept:'application/json'
                }
            })
    
    
            const {data} = resp;
            const {result,record, status}= data

            if(status){
              setArrivalLocationList(result)
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
    
        arrivalLocationListResult();
    
      },[updateList])

      const updateRecord = (Id) => {
        arrivalLocationList.map((item)=>{
  
          const {Arrival_Id} = item;
  
              if(Arrival_Id == Id){
                const {Arrival_Id,Departure_Location,Arrival_Location,Distance} = item;
  
                setPlaceholderData({Id:Arrival_Id,departure:Departure_Location,arrival:Arrival_Location,km:Distance,formType:"Update"})
  
                setShowModal(true)
                
              }
              
         })
  
        }
  
  return <>
  <div className='mainSection'>
<h1 className='mainSectionHeader'>Fleet Type Lists</h1>
      <div className='tableContainer'>
        <table>
        <thead>
           <tr>
          
              <th>Departure_Location</th>
              <th>Arrival_Location</th>
              <th>Distance</th>
              {
                (position === 1) && ( <th>Edit</th>)
              }
             

           </tr>
        </thead>
        <tbody>

        {
           error
           ? <tr><td className='nullError' colSpan={4}>{message}</td></tr>
           : (

            arrivalLocationList.map((item,index)=>{
                
             
                
                const {Arrival_Id,Departure_Location,Arrival_Location,Distance} = item
             
               return (
                      <tr key={Arrival_Id}>
                        <td >{Departure_Location}</td>
                        <td >{Arrival_Location}</td>
                        <td >{Distance}</td>
                        {
                          (position === 1) && (   <td ><FaEdit className='editBtn' onClick={()=>updateRecord(Arrival_Id)}/></td>)
                        }
                      </tr>
               )

              })
           )
        }
          </tbody>

        </table>
      </div>

      {
      showModal && (
         <div className='updateModal'>
             <div className='modalBg'></div>
            <IoClose className='closeModal' onClick={()=>{setShowModal(false);setUpdateList(true)}} />
            <ArrivalCUD {...placeholderData} />
          </div>
      )
     }



      </div>
  </>
}

export default ShowArrivalList