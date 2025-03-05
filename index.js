import express from 'express'
import dotenv from 'dotenv'
import { dbConnection } from './src/controllers/dbConnection.js'
import cors from 'cors'

dotenv.config({

    path:'./.env'
})


const app= express()
const PORT=process.env.PORT || 8001
app.use(cors())

dbConnection()
.then(
    app.listen(PORT,()=>{
        console.log(`SERVER STARTED AT ${PORT}`)
    })
)
.catch((error)=>{
    console.error("MONGODB ERROR",error)
})