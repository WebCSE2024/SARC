import { Publication } from "../models/publication.models.js";
import {asyncHandler} from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { deleteFromCloudinary, uploadOnCloudinary, uploadOnCloudinaryPublication } from "../connections/coludinaryConnection.js";
import { v4 as uuidv4 } from "uuid";
import { ApiResponse } from "../utils/ApiResponse.js";
import { client } from "../connections/redisConnection.js";
import { REDIS_CACHE_EXPIRY_PUBLICATIONS } from "../constants/constants.js";
import mongoose from "mongoose";
const generateUniqueId = () => {
    return uuidv4().replace(/-/g, "").substring(0, 7);
}

export const createPublication = asyncHandler(async(req,res)=>{
    
    if(!req.user)
        throw new ApiError(400,'Unauthenticated')
    const user=req.user
    if(req.user.role !== 'PROFESSOR')
        throw new ApiError(400,'Unauthorized')

    const pdf_path=req.file?.path
    if(!pdf_path)
        throw new ApiError(400,'pdf not found')

    const uploadedPdf = await uploadOnCloudinaryPublication(pdf_path)

    if(pdf_path && !uploadedPdf && !uploadedPdf.url)
        throw new ApiError(400,'cloudinary upload error')

    const publicationId=generateUniqueId()

    const newPublication = await Publication.create({
        publicationId,
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
                    from:'profs',
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
                    "publisher.linkedIn":1
                }
            }
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
                    from:'profs',
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
                    "publisher.linkedIn":1,
                    _id:0
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
                    publicationId:publicationid
                }
            },
            {
                $lookup:{
                    from:'profs',
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
                    "publisher.linkedIn":1,
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

    if(!(req.user.role === 'PROFESSOR'))
        throw new ApiError(400,'Unauthorized')


    if(!publicationid)
        throw new ApiError(400,'Publication-ID not available')

    const fetchPublication = await Publication.findOne({
        publicationId:publicationid
    })

    if(!fetchPublication)
       throw new ApiError(400,'No such publication exists')


    
    if (fetchPublication.publisher.toString() !== req.user._id.toString())
        throw new ApiError(400,'You are not permitted to delete it')

    await client.del(`publication:${publicationid}`)

    const response=await Publication.deleteOne({
        publicationId:publicationid

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
              publicationId:1,
              publicationURL:1
            },
          },
        ]);
      
        await client.set(`mypublication:${userId}`, JSON.stringify(result), 'EX', REDIS_CACHE_EXPIRY_PUBLICATIONS);
      
        return res.status(200).json(new ApiResponse(200, result, "Publication details fetched successfully"));
})
