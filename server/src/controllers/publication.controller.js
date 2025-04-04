import { Publication } from "../models/publication.models.js";
import {asyncHandler} from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { deleteFromCloudinary, uploadOnCloudinary, uploadOnCloudinaryPublication } from "../connections/coludinaryConnection.js";
import { v4 as uuidv4 } from "uuid";
import { ApiResponse } from "../utils/ApiResponse.js";
import { client } from "../connections/redisConnection.js";
import { REDIS_CACHE_EXPIRY_PUBLICATIONS } from "../constants/constants.js";
import mongoose from "mongoose";
// import { title } from "process";


export const createPublication = asyncHandler(async(req,res)=>{
    
    console.log('pub',req.body)
    if(!req.user)
        throw new ApiError(400,'Unauthenticated')
    const user=req.user
    if(req.user.userType !== 'professor')
        throw new ApiError(400,'Unauthorized')

    const {title}=req.body

    if(!title)
        throw new ApiError(400,'title is required')

    const pdf_path=req.file?.path
    if(!pdf_path)
        throw new ApiError(400,'pdf not found')

    const uploadedPdf = await uploadOnCloudinaryPublication(pdf_path)


    if(pdf_path && !uploadedPdf && !uploadedPdf.url)
        throw new ApiError(400,'cloudinary upload error')


    const newPublication = await Publication.create({
        title,
        publicationURL:uploadedPdf.url,
        publisher:req.user._id
    })

    if(!newPublication)
    {
        await  deleteFromCloudinary(uploadedPdf.publicId)
        throw new ApiError(400,'Error on creating publication')
    }

    const created_publication = await Publication.aggregate([
            {
                $match:{
                    _id:newPublication._id
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'publisher',
                    foreignField:'_id',
                    as:'publisher'
                }
            },
           
            
        ])
        
        await client.del('publication-list')
        return res.status(200).json(
            new ApiResponse(200,created_publication,'Publication created successfully')
        )
})

export const getAllPublications=asyncHandler(async(req,res)=>{
    
        const cacheResult = await client.get('publication-list')
        if(cacheResult)
            return res.status(200).json(
               new ApiResponse(200,JSON.parse(cacheResult),'all publications fetched successfully')
            )
    
        const response = await Publication.aggregate([
            
            {
                $lookup:{
                    from:'users',
                    localField:'publisher',
                    foreignField:'_id',
                    as:'publisher'
                }
            }
    
        ])
    
    
        if(!response)
            throw new ApiError(400,'no publications found')
    
        await client.set('publication-list',JSON.stringify(response),'EX',REDIS_CACHE_EXPIRY_PUBLICATIONS)
        return res.status(200).json(
            new ApiResponse(200,response,'publication-list fetched successfully')
        )
})

export const getPublicationDetails=asyncHandler(async(req,res)=>{
    
    const publicationid=req.params.publicationid

    if(!publicationid)
        throw new ApiError(400,'Publication-ID not available')

    const cacheResult = await client.get(`publication:${publicationid}`)
    if(cacheResult)
        return res.status(200).json(
           new ApiResponse(200,JSON.parse(cacheResult),' publication details fetched successfully')
        ) 
    
        const publication_data = await Publication.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(publicationid)
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'publisher',
                    foreignField:'_id',
                    as:'publisher'
                }
            },
           
            {
                $project:{
                    publicationId:1,
                    publicationURL:1,
                    'publisher.full_name':1,
                    'publisher.email':1,
                    "publisher.professorDetails":1,
                    _id:0
                }
            }
        ])
        
        await client.set(`publication:${publicationid}`,JSON.stringify(publication_data),'EX',REDIS_CACHE_EXPIRY_PUBLICATIONS)
        return res.status(200).json(new ApiResponse(200, publication_data, 'publication data fetched successfully'))
    
})

export const deletePublication = asyncHandler(async(req,res)=>{
    const publicationid=req.params.publicationid
   
    if(!req.user)
        throw new ApiError(400,'Unauthenticated')

    if(!(req.user.role === 'professor' || req.user.role === 'admin'))
        throw new ApiError(400,'Unauthorized')


    if(!publicationid)
        throw new ApiError(400,'Publication-ID not available')

    const fetchPublication = await Publication.findOne({
        _id:new mongoose.Types.ObjectId(publicationid)
    })

    if(!fetchPublication)
       throw new ApiError(400,'No such publication exists')


    
    if (fetchPublication.publisher.toString() !== req.user._id.toString())
        throw new ApiError(400,'You are not permitted to delete it')

    await client.del(`publication:${publicationid}`)

    const response=await Publication.deleteOne({
        _id:new mongoose.Types.ObjectId(publicationid)

    })
     
    if(!response)
       throw new ApiError(400,'Can not delete the publication')
    
    return res.status(200).json(
        new ApiResponse(200,null,'publication deleted successfully')
    )
})

export const getMyPublications = asyncHandler(async(req,res)=>{
// console.log('hii')
     const userId = req.user._id;
      
        if (!userId) throw new ApiError(400, "No user exists");
      
        const cacheResult = await client.get(`mypublication:${userId}`);
      
        if (cacheResult) {
          return res
            .status(200)
            .json(new ApiResponse(200, JSON.parse(cacheResult), "Publication details fetched successfully"));
        }

    //    console.log("MYPUB",req.user)
        const result = await Publication.aggregate([
          {
            $match: {
              publisher: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $project: {
            //   publicationId:1,
              publicationURL:1,
              title:1,
            },
          },
        ]);
      
        await client.set(`mypublication:${userId}`, JSON.stringify(result), 'EX', REDIS_CACHE_EXPIRY_PUBLICATIONS);
      
        return res.status(200).json(new ApiResponse(200, result, "Publication details fetched successfully"));
})
