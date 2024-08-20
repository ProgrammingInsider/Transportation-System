import {useEffect, useState} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
// COMPONENTS
import RegisterCUD from './RegisterCUD';
import {useGlobalContext} from '../../contextAPI'

// ICONS
import { IoClose } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// QUERY
import { FetchAll,Delete } from '../../axios/axios';

const ShowAdminList = () => {
   const axiosPrivate = useAxiosPrivate();
  const {auth} = useGlobalContext();
  const [placeholderData, setPlaceholderData] = useState();
    const[adminList, setAdminList] = useState([]);
    const[error, setError] = useState(false);
    const positionArray = ["Admin","Owner"]
    const[showModal, setShowModal] = useState(false);
    const[updateList, setUpdateList] = useState(false);
    const[deleteList, setDeleteList] = useState(false);
    const[message,setMessage] = useState("There is no Admin or Owner records here.")

    const position = auth?.payload?.Position

    useEffect(()=>{
        const getAdminResult = async() => {

          try {

            const resp = await axiosPrivate.get("/admin",{
                  Headers:{
                      Accept:'application/json'
                  }
              })
      
      
              const {data} = resp;
              const {result,record, status}= data
              
              if(status){
                setAdminList(result)
            }else{
                setError(true)
            }

            
        } catch (err) {
          // Handle the error
          if(!err?.response){
            setMessage("No server Response")
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

        getAdminResult();
    },[updateList,deleteList])

    const updateRecord = (Id) => {
      adminList.map((item,index)=>{

        const {Admin_Id} = item;

            if(Admin_Id == Id){
              const {Admin_Id,Email,First_Name,Last_Name,Password,Position } = item;

              setPlaceholderData({Id:Admin_Id,fname:First_Name,lname:Last_Name,adminEmail:Email,adminPosition:Position,formType:"Update"})

              setShowModal(true)
              
            }
            
       })

      }

    const  deleteRecord = async (Email) => {
      
        let text = `Are you sure you want to delete an Admin with ${Email} Email`;
          if (window.confirm(text) == true) {
            try {

              const {data} = await axiosPrivate.delete(`/admin/delete?Email=${Email}&Departure_Name=""`,{
                  Headers:{
                      Accept:'application/json'
                  }
              })
      
              const {isDeleted,Message} = data

              if(isDeleted){
                setDeleteList(true);
              }
              
          } catch (err) {
            // Handle the error
            if(!err?.response){
              setMessage("Delete Failed")
           }else if(err.response?.status === 400){
             setMessage("Missing information")
           }else if(err.response?.status === 401){
             setMessage("Unauthorized")
           }else if(err.response?.status === 403){
             setMessage("Forbidden")
           }else{
             setMessage("Delete Failed")
           }
          }
           
    }
    } 


  return <>

<div className='mainSection'>
<h1 className='mainSectionHeader'>Admin Lists</h1>
      <div className='tableContainer'>
        <table>
        <thead>
           <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Position</th>
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
           ? <tr><td className='nullError' colSpan={6}>{message}</td></tr>
           : (

            adminList.map((item,index)=>{
                
                const {Admin_Id,Email,First_Name,Last_Name,Password,Position} = item
             
               return (
                      <tr key={Admin_Id}>
                        <td >{First_Name}</td>
                        <td >{Last_Name}</td>
                        <td >{Email}</td>
                        <td >{positionArray[Position]}</td>
                        {
                          (position === 1) && <>
                          
                          <td ><FaEdit className='editBtn' onClick={()=>updateRecord(Admin_Id)}/></td>
                          <td ><MdDelete className='deleteBtn' onClick={()=>deleteRecord(Email)}/></td>
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
            <RegisterCUD {...placeholderData} />
          </div>
      )
    }


      </div>
  
  </>
}

export default ShowAdminList