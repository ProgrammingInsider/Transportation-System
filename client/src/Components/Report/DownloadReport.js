import {useEffect, useState} from 'react'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

// QUERY
import { FetchAll,FetchByDeparture } from '../../axios/axios';

//PACKAGE TO EXPORT DATA AS EXCEL
import * as XLSX from 'xlsx';

const DownloadReport = () => {
  const axiosPrivate = useAxiosPrivate();
    const [vehicleList, setVehicleLists] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [filteredVehicleList, setFilteredVehicleLists] = useState([]);
    const [filteredEmployeeList, setFilteredEmployeeList] = useState([]);
    const [filteredTripList, setFilteredTripList] = useState([]);
    const[filterByVehicle,setFilterByVehicle] = useState("All")
    const[filterByEmploye,setFilterByEmploye] = useState("All")
    const[filterByTrip,setFilterByTrip] = useState("All")
    const [vehicleRecord, setVehicleRecord] = useState();
    const [tripList, setTripList] = useState([]);
    const [employeeRecord, setEmployeeRecord] = useState();
    const [tripRecord, setTripRecord] = useState();
    const [departureTown,setDepartureTown] = useState([]);
  


    useEffect(()=>{
        const getVehicleLists = async() => {

          try {

            const resp = await axiosPrivate.get("/vehicle",{
                Headers:{
                    Accept:'application/json'
                }
            })
    
    
            const {data} = resp;
            const {result,record, status}= data
            setVehicleLists(result)
            setVehicleRecord(record)
            setFilteredVehicleLists(result)
            
            
        } catch (error) {
          // Handle the error
          console.error('Error fetching data:', error);
        }
    
         
      }
                
        getVehicleLists();
    
        },[])

        useEffect(()=>{
            const getEmployeeList = async() => {

              try {

                const resp = await axiosPrivate.get("/agent",{
                    Headers:{
                        Accept:'application/json'
                    }
                })
        
        
                const {data} = resp;
                const {result,record, status}= data

                setEmployeeList(result)
                setEmployeeRecord(record)
                setFilteredEmployeeList(result)
                
            } catch (error) {
              // Handle the error
              console.error('Error fetching data:', error);
            }

        }            
            getEmployeeList();
        
            },[])

            useEffect(()=>{
              const getTripList = async() => {

                try {

                  const resp = await axiosPrivate.get("/trip",{
                      Headers:{
                          Accept:'application/json'
                      }
                  })
          
          
                  const {data} = resp;
                  const {result,record, status}= data

                  setTripList(result)
                  setTripRecord(record)
                  setFilteredTripList(result)
                  
              } catch (error) {
                // Handle the error
                console.error('Error fetching data:', error);
              }

            }    
                      getTripList();
              },[])



            useEffect(()=>{
                const getDepartureName = async() => {

                  try {

                    const resp = await axiosPrivate.get("/departure",{
                        Headers:{
                            Accept:'application/json'
                        }
                    })
            
            
                    const {data} = resp;
                    const {result,record, status}= data
                    setDepartureTown(result)
                    
                    
                } catch (error) {
                  // Handle the error
                  console.error('Error fetching data:', error);
                }
  
          }
                        
                        getDepartureName();
            
                },[])

                useEffect(()=>{
                  const getFilterVehicleLists = async() => {
                    
                    const newVehicleList = vehicleList.filter((item)=>{
                      const {Departure_Name} = item
                    
                      if(filterByVehicle !== "All"){

                        if(Departure_Name === filterByVehicle){
                          
                          return item;
                        }

                      }else{
                         return item
                      }

                })
                
                     setVehicleRecord(newVehicleList.length)
                    setFilteredVehicleLists(newVehicleList);
                  }
                  
                        getFilterVehicleLists();
                        
                },[filterByVehicle])


                useEffect(()=>{
                  const getFilterEmployeeLists = async() => {
                    
                    const newEmplloyeList = employeeList.filter((item)=>{
                      const {Departure_Name} = item
                    
                      if(filterByEmploye !== "All"){

                        if(Departure_Name === filterByEmploye){
                        
                          return item;
                        }

                      }else{
                         return item
                      }

                    })
                
                     setEmployeeRecord(newEmplloyeList.length)
                    setFilteredEmployeeList(newEmplloyeList);
                  }
                  
                  getFilterEmployeeLists();
                        
                },[filterByEmploye])


                useEffect(()=>{
                  const getFilterTripLists = async() => {
                    
                    const newTripList = tripList.filter((item)=>{
                      const {Departure_Location} = item
                    
                      if(filterByTrip !== "All"){

                        if(Departure_Location === filterByTrip){
                        
                          return item;
                        }

                      }else{
                         return item
                      }

                    })
                
                     setTripRecord(newTripList.length)
                    setFilteredTripList(newTripList);
          
                  }
                  
                  getFilterTripLists();
                        
                },[filterByTrip])
              


        const downloadVehicleList = () => {
          if(filteredVehicleList.length){

            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(filteredVehicleList);
            XLSX.utils.book_append_sheet(wb,ws,"Vehicle List");
            XLSX.writeFile(wb,"Vehicle List.xlsx")

          }else{
             alert("You can export null Excel document")
          }
        }

        const downloadEmployeList = () => {
          if(filteredEmployeeList.length){

            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(filteredEmployeeList);
            XLSX.utils.book_append_sheet(wb,ws,"Employe List");
            XLSX.writeFile(wb,"Employee List.xlsx")

          }else{
             alert("You can export null Excel document")
          }
        }

        const downloadTripList = () => {
          if(filteredTripList.length){
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(filteredTripList);
            XLSX.utils.book_append_sheet(wb,ws,"Trip List");
            XLSX.writeFile(wb,"Trip List.xlsx")
          }else{
             alert("You can export null Excel document")
          }
        }

  return <>
  <div className='mainSection'>
    <h1 className='mainSectionHeader'>Get Report</h1>

    <div className='tableContainer'>
      <table>
      <thead>
         <tr>
            <th>Report Name</th>
            <th>Number of Records</th>
            <th>Location</th>
        
            <th>Download</th>
         </tr>
      </thead>
      <tbody>
                <tr>
                      <td >Vehicle List</td>
                      <td >{vehicleRecord}</td>
                      <td>
                        <div className='departureDropDown form-input-dropDown'>
                          <label htmlFor='departureTown'>
                              <select name="departure" id="departureTown" className='form-input dropDowns' value={filterByVehicle} onChange={(e)=>setFilterByVehicle(e.target.value)} required>
                                  <option value="All">All</option>
                                  {
                                  departureTown.map((item)=>{
                                      const {Departure_Id,Departure_Name} = item
                                    
                                      return (
                                          <option key={Departure_Id} value={Departure_Name} >{Departure_Name}</option>
                                      )
                                  })
                                  }
                                  
                              </select>
                          </label>
                          </div>
                      </td>
                     
                      <td ><button className='form-btn form-input' onClick={downloadVehicleList}>Download</button></td>
                 </tr>
                 <tr>
                      <td >Employee List</td>
                      <td >{employeeRecord}</td>
                      <td>
                        <div className='departureDropDown form-input-dropDown'>
                          <label htmlFor='departureTown'>
                              <select name="departure" id="departureTown" className='form-input dropDowns' value={filterByEmploye} onChange={(e)=>setFilterByEmploye(e.target.value)} required>
                                  <option value="All">All</option>
                                  {
                                  departureTown.map((item)=>{
                                      const {Departure_Id,Departure_Name} = item
                                      return (
                                          <option key={Departure_Id} value={Departure_Name}>{Departure_Name}</option>
                                       )
                                  })
                                  }
                                  
                              </select>
                          </label>
                          </div>
                      </td>
                      <td ><button className='form-btn form-input' onClick={downloadEmployeList}>Download</button></td>
                 </tr>
                 <tr>
                      <td >Trip List</td>
                      <td >{tripRecord}</td>
                      <td>
                        <div className='departureDropDown form-input-dropDown'>
                          <label htmlFor='departureTown'>
                              <select name="departure" id="departureTown" className='form-input dropDowns' value={filterByTrip} onChange={(e)=>setFilterByTrip(e.target.value)} required>
                                  <option value="All">All</option>
                                  {
                                  departureTown.map((item)=>{
                                      const {Departure_Id,Departure_Name} = item
                                      return (
                                          <option key={Departure_Id} value={Departure_Name}>{Departure_Name}</option>
                                      )
                                  })
                                  }
                                  
                              </select>
                          </label>
                          </div>
                      </td>

                      <td ><button className='form-btn form-input' onClick={downloadTripList}>Download</button></td>
                 </tr>
        </tbody>


        

      </table>
    </div>

  </div>
</>
}

export default DownloadReport