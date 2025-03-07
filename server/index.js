import dotenv from 'dotenv'
import { dbConnection } from './src/config/dbConnection.js'
import { app } from './app.js'

dotenv.config({

    path:'./.env'
})

const PORT=process.env.PORT || 8001

dbConnection()
.then(
    app.listen(PORT,()=>{
        console.log(`SERVER STARTED AT ${PORT}`)
    })
)
.catch((error)=>{
    console.error("MONGODB ERROR",error)
})