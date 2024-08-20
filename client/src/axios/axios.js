// import baseURL from "./baseURL";

// export const Signin = async(url,insertedData) => {

//     try {

//         const resp = await baseURL.post(url,insertedData,{
//             Headers:{
//                 Accept:'application/json'
//             }
//         }) 

//         var Message;
//         var isLoggedIn;


//         const {data} = resp;
//         const {EmailMatch, PasswordMatch, token}= data

//         if(EmailMatch){
//             if(PasswordMatch){
//                 if(token !== null){
//                     localStorage.setItem("token",token);
//                     Message = `Logged In`;
//                     isLoggedIn = true;

//                 }else{

//                 }
//             }else{
//                 Message = `Password Incorrect`;
//                 isLoggedIn = false;

//             }
//         }else{
//             Message=`Email Incorrect`;
//             isLoggedIn=false;
//         }

//         return {Message, isLoggedIn}

    
//   } catch (error) {
//     // Handle the error
//     console.error('Error fetching data:', error);
//   }

// }

// export const Insert = async(url,insertedData) => {

//     try{
//         const {data} = await baseURL.post(url,insertedData,{
//             Headers:{
//                 Accept:'application/json'
//             }
//         })
    
//         const {isRegistered, Message} = await data
    
//         return {isRegistered, Message};

//     }catch (error) {
//         // Handle the error
//         console.error('Error inserting data:', error);
//       }

// }

// export const Update = async(url,sentData) => {

//     try {

//         const {data} = await baseURL.put(url,sentData,{
//             Headers:{
//                 Accept:'application/json'
//             }
//         })

//         const {updatedData,Message,changedRows} = data


//         return {updatedData,Message,changedRows}
        
//     } catch (error) {
//       // Handle the error
//       console.error('Error updating data:', error);
//     }
// }

// export const FetchAll = async (url) => {
    
//     try {

//         const resp = await baseURL.get(url,{
//             Headers:{
//                 Accept:'application/json'
//             }
//         })


//         const {data} = resp;
//         const {result,record, status}= data
        
//         return {result,record, status};
        
//     } catch (error) {
//       // Handle the error
//       console.error('Error fetching data:', error);
//     }
// }

// export const FetchByDeparture = async (url,Departure_Name) => {
    
//     try {

//         var resp;

//         if(Departure_Name === "All"){
//             resp = await baseURL.get(url,{
//             Headers:{
//                 Accept:'application/json'
//             }
//         }) 
            
//         }else{ 

//             resp = await baseURL.get(`${url}/search?Departure_Name=${Departure_Name}`,{
//                 Headers:{
//                     Accept:'application/json'
//                 }
//             }) 
            
//         }
    
//         const {data} = resp;
//         const {result,record}= data
        
//         return {result,record};
        
//     } catch (error) {
//       // Handle the error
//       console.error('Error fetching data:', error);
//     }
// }

// export const Delete = async (url,Key,Value,Departure_Name) => {

//     try {

//         const {data} = await baseURL.delete(`${url}/delete?${Key}=${Value}&Departure_Name=${Departure_Name}`,{
//             Headers:{
//                 Accept:'application/json'
//             }
//         })

//         const {isDeleted,Message} = data


//         return {isDeleted,Message} 
        
//     } catch (error) {
//       // Handle the error
//       console.error('Error deleting data:', error);
//     }
// }

// export const getProfile = async() => {
    
//     try {

//         const token = localStorage.getItem("token");
        
//         if(token !== ""){
            
//             const {data} = await baseURL.get(`/profile`,{
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             })
            
    
//             return data;
//         }
        
//         return {isLoggedIn:false, Email:"", First_Name:"", Last_Name:"", Position:""}
        
//     } catch (error) {
//         if (error.code === 'ERR_CONNECTION_REFUSED') {
//             // Retry the request
//             console.log(`Retrying`);
//             // return authenticateWithRetry(token, retries - 1);
//           } else {
//             // Handle other errors
//             console.error('Authentication failed:', error.message);
//             throw error;
//           }// Handle the error
//       console.error('Error fetching data:', error);
//     }

// }