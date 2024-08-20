import EmployeeCUD from "./EmployeeCUD"

const EmployeeForm = () => {
 
    const insertedData = {Id:0,fname:"",lname:"",pnumber:"",pass:"",rePass:"",departure:"",formType:"Register"}
    return<>
         <EmployeeCUD {...insertedData} />
    </>  
    
  
}

export default EmployeeForm