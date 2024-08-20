import con from "../Db/connection.js";

export const postDb = async (sql) => {
    try{
        
        const resp = await new Promise((resolve,reject)=>{
            con.query(sql,(err,result)=>{
                if(err){
                    reject(err)
                }else{    
                    resolve(result)
                }
            })
        });

        return resp

    }catch(error){
       
        throw new error
    }
}