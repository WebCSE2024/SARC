import express, { json, urlencoded } from 'express'
import cors from 'cors'
import { errorHandler } from './src/middlewares/errorhandler';

const app= express()


app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//api routes


app.use(errorHandler)
export {app}