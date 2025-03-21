import cors from 'cors'
import { errorHandler } from './src/middlewares/errorhandler.js';
import referralRouter from './src/routes/referral.routes.js'
import eventRouter from './src/routes/event.routes.js'
import publicationRouter from './src/routes/publications.routes.js'
import express from 'express'

const app= express()

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('hello from server')
})
//api routes
app.get('/sarc/v0/api',(req,res)=>{
    res.send('hello from server api')
})


app.use('/sarc/v0/api/referral',referralRouter)
app.use('/sarc/v0/api/event',eventRouter)
app.use('/sarc/v0/api/publication',publicationRouter)


app.use(errorHandler)
export {app}