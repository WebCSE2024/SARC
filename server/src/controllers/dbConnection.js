import mongoose from "mongoose"

export const dbConnection = async()=>{
    
    const dbUrl=process.env.MONGODB_URL
    try{
       const db = await  mongoose.connect(dbUrl)
       console.log('DB CONNECTED !')
    }catch(error){
        console.error('ERROR IN DB CONNECTION',error)
        process.exit(1)
    }
}