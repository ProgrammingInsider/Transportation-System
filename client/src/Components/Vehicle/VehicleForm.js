import VehicleCUD from "./VehicleCUD"

const VehicleForm = () => {
  const insertedData = {VehicleId:0,P_plateNumber:"",P_level:"",P_associationName:"",P_region:"",P_fleetName:"",P_status:1,P_seatNumber:1,P_departureName:"",formType:"Register"}
   return<>
        <VehicleCUD {...insertedData} />
   </>
}

export default VehicleForm