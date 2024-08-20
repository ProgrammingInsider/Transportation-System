import RegisterCUD from "./RegisterCUD"

const RegisterForm = () => {

    const insertedData = {Id:0,fname:"",lname:"",adminEmail:"",adminPosition:1,formType:"Register"}
    return<>
         <RegisterCUD {...insertedData} />
    </>    
  
}

export default RegisterForm