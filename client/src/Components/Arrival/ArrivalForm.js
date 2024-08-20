import ArrivalCUD from "./ArrivalCUD"

const ArrivalForm = () => {
 
    const insertedData = {Id:0,departure:"",arrival:"",km:0,formType:"Register"}
    return<>
         <ArrivalCUD {...insertedData} />
    </>  


  
}

export default ArrivalForm