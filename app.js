import cors from 'cors'
import { errorHandler } from './src/middlewares/errorhandler.js';
import  {setUser}  from './src/middlewares/setUser.js';
import referralRouter from './src/routes/referral.routes.js'
import express from 'express'

const app= express()

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('hello from server')
})
//api routes
app.get('/api',(req,res)=>{
    res.send('hello from server api')
})
app.use('/api/referral',referralRouter)

app.use(errorHandler)
export {app}