import cors from 'cors'
import { errorHandler } from './src/middlewares/errorhandler.js';
import referralRouter from './src/routes/referral.routes.js'
import publicationRouter from './src/routes/publications.routes.js'
import express from 'express'
import seminarRouter from './src/routes/seminar.routes.js'
import achievementRoutes from './src/routes/achievement.routes.js'
import commentRouter from './src/routes/comments.routes.js'
import likeRouter from './src/routes/likes.routes.js'

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
app.use('/sarc/v0/api/publication',publicationRouter)
app.use('/sarc/v0/api/seminar',seminarRouter)
app.use('/sarc/v0/api/achievement',achievementRoutes)
app.use('/cses/v0/api/likes', likeRouter);
app.use('/cses/v0/api/comments', commentRouter);



app.use(errorHandler)
export {app}