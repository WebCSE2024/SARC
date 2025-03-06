import { profs } from "../randomdata/prof.random.js";
import {alumni} from '../randomdata/alumni.random.js'
import { students } from "../randomdata/student.random.js";
import { Prof } from "../models/prof.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Alumni } from "../models/alumni.models.js";

const currArray=alumni
export const setUser=async(req,res,next)=>{
   
    const idx=Math.floor(Math.random()*15)
    const currUser=currArray[idx]
    console.log(currUser)
    try {
        const user=await Alumni.findOne({email:currUser.email})
        req.user=user
        console.log(req.user)
        next()
    } catch (error) {
        throw new ApiError(400,"No user found")        
    }
}

