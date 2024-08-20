import {useState, useEffect} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate.js';

// ICONS
import { IoClose } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// COMPONENTS
import EmployeeCUD from './EmployeeCUD.js';
import {useGlobalContext} from "../../contextAPI.js"


const ShowEmployeeList = () => {
  const axiosPrivate = useAxiosPrivate();
  const {auth} = useGlobalContext();

  const [employeeList, setEmployeeList] = useState([]);
  const[error, setError] = useState(false);
  const [placeholderData, setPlaceholderData] = useState();  
  const[showModal, setShowModal] = useState(false);
  const[updateList, setUpdateList] = useState(false);
  const[deleteList, setDeleteList] = useState(false);
  const[message,setMessage] = useState("There no Employee records here.")

  const position = auth?.payload?.Position;


  useEffect(()=>{
    const employeeListResult = async() => {

      try {

        const resp = await axiosPrivate.get("/agent",{
            Headers:{
                Accept:'application/json'
            }
        })


        const {data} = resp;
        const {result,record, status}= data

        if(status){
          setEmployeeList(result)
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

    employeeListResult();

  },[updateList,deleteList])

  const  deleteRecord = async (phoneNUmber,departureName) => {
      
    let text = `Are you sure you want to delete an employee with ${phoneNUmber} phone number`;
    if (window.confirm(text) == true) {

      try {

        const {data} = await axiosPrivate.delete(`/agent/delete?Phone_Number=${phoneNUmber}&Departure_Name=${departureName}`,{
            Headers:{
                Accept:'application/json'
            }
        })

        const {isDeleted,Message} = data
        if(isDeleted){
          setDeleteList(true);
        }
        
    } catch (error) {
      // Handle the error
      console.error('Error deleting data:', error);
    }

      }

} 

  const updateRecord = (Id) => {
    employeeList.map((item,index)=>{

      const {Agent_Id} = item

          if(Agent_Id == Id){
            const {Agent_Id,First_Name,Last_Name,Phone_Number,Password,Departure_Name} = item;
            
            setPlaceholderData({Id:Agent_Id,fname:First_Name,lname:Last_Name,pnumber:Phone_Number,pass:Password,rePass:Password,departure:Departure_Name,formType:"Update"})
            setShowModal(true)    
          }       
          
     })

    }

   
  return  <>
  <div className='mainSection'>
<h1 className='mainSectionHeader'>Employee Lists</h1>
      <div className='tableContainer'>
        <table>
        <thead>
           <tr>
          
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
              <th>Departure Name</th>
              <th>Registeration Date</th>
              {
                (position === 1) && <>   
                  <th>Edit</th>
                  <th>Delete</th>
                </>
              }
           </tr>
        </thead>
        <tbody>

        {
           error
           ? <tr><td className='nullError' colSpan={7}>{message}</td></tr>
           : (

            employeeList.map((item,index)=>{
              
                const {Agent_Id,First_Name,Last_Name,Phone_Number,Password,Departure_Name,Registeration_Date} = item
             
               return(
                      <tr key={Agent_Id}>
                        <td >{First_Name}</td>
                        <td >{Last_Name}</td>
                        <td >{Phone_Number}</td>
                        <td >{Departure_Name}</td>
                        <td >{Registeration_Date}</td>
                        {
                          (position === 1) && <>   
                             <td ><FaEdit className='editBtn' onClick={()=>updateRecord(Agent_Id)}/></td>
                             <td ><MdDelete className='deleteBtn' onClick={()=>deleteRecord(Phone_Number,Departure_Name)}/></td>
                          </>
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
            <EmployeeCUD {...placeholderData} />
          </div>
      )
     }
      </div>
  </>
}

export default ShowEmployeeList