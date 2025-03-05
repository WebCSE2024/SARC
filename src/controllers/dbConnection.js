import mongoose from "mongoose"

export const dbConnection = async()=>{
    
    const dbUrl=process.env.MONGODB_URL
    try{
       const db = await  mongoose.connect(dbUrl)
       console.log('DB CONNECTED !')
    }catch{
        console.error('ERROR IN DB CONNECTION')
        process.exit(1)
    }
}