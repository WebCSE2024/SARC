import { deleteFromCloudinary, uploadOnCloudinary } from '../connections/coludinaryConnection.js'
import { client } from '../connections/redisConnection.js'
import { REDIS_CACHE_EXPIRY_EVENTS } from '../constants/constants.js'
import {Event} from '../models/event.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/AsyncHandler.js'
import { v4 as uuidv4 } from "uuid";


const generateReferralId = () => {
    return uuidv4().replace(/-/g, "").substring(0, 7);
}

export const createEvent = asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(400, 'Unauthenticated')

    if (req.user.role !== 'PROFESSOR') throw new ApiError(400, 'Unautherized')

    const { title, eventDate, reg_url, description, FIC } = req.body

    if ([title, eventDate, reg_url, description, FIC].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const event_img = req.file?.path
    console.log("FILES UPLOADED", req.file)

    const img_url = await uploadOnCloudinary(event_img)

    if (event_img && !img_url?.url) throw new ApiError(400, 'cloudinary upload failed')

    console.log('EVENTREG', img_url)
    const eventId=generateReferralId()

    const new_event = await Event.create({
        title,
        eventId,
        eventDate,
        reg_url,
        description,
        FIC: req.user._id,
        img_url: img_url ? img_url.url : null
    })

    if (!new_event) {
        if (img_url) deleteFromCloudinary(img_url.publicId)
        throw new ApiError(400, 'error in event creation')
    }
    await client.del('events-list')
    const created_event = await Event.aggregate([
        {
            $match:{
                _id:new_event._id
            }
        },
        {
            $lookup:{
                from:'profs',
                localField:'FIC',
                foreignField:'_id',
                as:'FIC'
            }
        },
       
        {
            $project:{
                title:1,
                eventDate:1,
                description:1,
                img_url:1,
                reg_url:1,
                eventId:1,
                'FIC.full_name':1,
                'FIC.email':1,
                "FIC.linkedIn":1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, created_event, 'event created successfully'))
})

export const getAllEvents=asyncHandler(async(req,res)=>{

    const cacheResult = await client.get('events-list')
    if(cacheResult)
        return res.status(200).json(
           new ApiResponse(200,JSON.parse(cacheResult),'all events fetched successfully')
        )

    const response = await Event.aggregate([
        
        {
            $lookup:{
                from:'profs',
                localField:'FIC',
                foreignField:'_id',
                as:'FIC'
            }
        },
       
        {
            $project:{
                title:1,
                eventDate:1,
                description:1,
                img_url:1,
                reg_url:1,
                eventId:1,
                'FIC.full_name':1,
                'FIC.email':1,
                "FIC.linkedIn":1,
                _id:0
            }
        }

    ])


    if(!response)
        throw new ApiError(400,'no events found')

    await client.set('events-list',JSON.stringify(response),'EX',REDIS_CACHE_EXPIRY_EVENTS)
    return res.status(200).json(
        new ApiResponse(200,response,'event-list fetched successfully')
    )
})

export const getEventDetails=asyncHandler(async(req,res)=>{
    
    const eventid=req.params.eventid
    
    if(!eventid)
        throw new ApiError(400,'Event-ID not available')

    const cacheResult = await client.get(`event:${eventid}`)
    if(cacheResult)
        return res.status(200).json(
           new ApiResponse(200,JSON.parse(cacheResult),'all events fetched successfully')
        ) 
    
        const event_data = await Event.aggregate([
            {
                $match:{
                    eventId:eventid
                }
            },
            {
                $lookup:{
                    from:'profs',
                    localField:'FIC',
                    foreignField:'_id',
                    as:'FIC'
                }
            },
           
            {
                $project:{
                    title:1,
                    eventDate:1,
                    description:1,
                    img_url:1,
                    reg_url:1,
                    eventId:1,
                    'FIC.full_name':1,
                    'FIC.email':1,
                    "FIC.linkedIn":1,
                    _id:0
                }
            }
        ])
        
        await client.set(`event:${eventid}`,JSON.stringify(event_data),'EX',REDIS_CACHE_EXPIRY_EVENTS)
        return res.status(200).json(new ApiResponse(200, event_data, 'event data fetched successfully'))
    
})

export const deleteEvent = asyncHandler(async(req,res)=>{
    const eventid=req.params.eventid

    if(!eventid)
        throw new ApiError(400,'Event-ID not available')
    await client.del(`event/:${eventid}`)

    const response=await Event.deleteOne({
        eventId:eventid

    })

    if(!response)
       throw new ApiError(400,'can not delete the event')

    return res.status(200).json(
        new ApiResponse(200,null,'event deleted successfully')
    )
})
