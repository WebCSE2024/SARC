import { profs } from "../randomdata/prof.random.js";
import {alumni} from '../randomdata/alumni.random.js'
import {students} from '../randomdata/student.random.js'
import {User} from '../models/user.models.js'
import { ApiError } from "../utils/ApiError.js";


// console.log('alumni',alumni.length)
const admin ={

    userType:'admin',
    username:'admin',
    fullname:'admin',
    password:'admin'
}
const currArray=profs
export const setUser=async(req,res,next)=>{
   
    const idx=Math.floor(Math.random()*15)
    const currUser=currArray[idx]
    console.log('setuser',currUser)
    try {
        // const user=await User.findOne({email:currUser.email})
        req.user=admin
        console.log(req.user)
        next()
    } catch (error) {
        throw new ApiError(400,"No user found")        
    }
}