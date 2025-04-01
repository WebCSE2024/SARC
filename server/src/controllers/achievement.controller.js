import { deleteFromCloudinary, uploadOnCloudinary } from '../connections/coludinaryConnection.js';
import Achievement from '../models/achievement.models.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { v4 as uuidv4 } from 'uuid'

const generateReferralId = () => {
    return uuidv4().replace(/-/g, "").substring(0, 7);
};

export const createAchievement = asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(400, 'Unauthenticated');

    if (req.user.role !== 'admin') throw new ApiError(400, 'Unauthorized');

    const { title, description, date, awardedTo, initiative, tags, socialMediaLinks } = JSON.parse(req.body.data)
    
    if ([title, description, date, awardedTo].some(field => !field?.trim())) {
        throw new ApiError(400, "Required fields are missing");
    }
    // Check if required fields are missing

    console.log('FILES',req.files)
    const gallery = [];
    if (req.files?.length > 0) {
        for (const file of req.files) {
            const uploadedImage = await uploadOnCloudinary(file.path);
            console.log('UPLOADED IMAGE',uploadedImage)
            if (!uploadedImage?.url) throw new ApiError(400, 'Cloudinary upload failed');
            gallery.push({url:uploadedImage.url,publicId:uploadedImage.public_id});
        }
    }
    const achievementId = generateReferralId();
    const newAchievement = await Achievement.create({
        title,
        description,
        date,
        awardedTo,
        initiative,
        tags,
        gallery,
        socialMediaLinks,
        status:'published',
        achievementId: achievementId
    });

    if (!newAchievement) {
        if (gallery.length > 0) {
            for (const img of gallery) {
                await deleteFromCloudinary(img.publicId);
            }
        }
        throw new ApiError(400, 'Error in creating achievement');
    }
    return res.status(200).json(new ApiResponse(200, newAchievement, 'Achievement created successfully'));

});

export const getAllAchievements = asyncHandler(async (req, res) => {
    const achievements = await Achievement.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'awardedTo',
                foreignField: '_id',
                as: 'awardedTo'
            }
        },
       
        {
            $project: {
                title: 1,
                description: 1,
                date: 1,
                tags: 1,
                gallery: 1,
                socialMediaLinks: 1,
                status: 1,
                'awardedTo.full_name': 1,
                'awardedTo.email': 1,
                // '_id': 0,
                'achievementId': 1
                
            }
        }
    ]);

    if (!achievements) throw new ApiError(400, 'No achievements found');
    return res.status(200).json(new ApiResponse(200, achievements, 'Achievements fetched successfully'));
});

export const getAchievementDetails = asyncHandler(async (req, res) => {
    const { achievementId } = req.params;
    if (!achievementId) throw new ApiError(400, 'Achievement ID is required');
    const achievement = await Achievement.aggregate([
        {
            $match: {
                achievementId: achievementId
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'awardedTo',
                foreignField: '_id',
                as: 'awardedTo'
            }
        },
        
        {
            $project: {
                title: 1,
                description: 1,
                date: 1,
                _id:0,
                tags: 1,
                gallery: 1,
                achievementId: 1,
                socialMediaLinks: 1,
                status: 1,
                'awardedTo.full_name': 1,
                'awardedTo.email': 1,
                
            }
        }
    ]);
    if (!achievement) throw new ApiError(404, 'Achievement not found');
    return res.status(200).json(new ApiResponse(200, achievement, 'Achievement details fetched successfully'));
});

export const deleteAchievement = asyncHandler(async (req, res) => {
    const { achievementId } = req.params;
    const achievement = await Achievement.findOne({ achievementId });
    if (!achievement) throw new ApiError(404, 'Achievement not found');


    console.log('ACHIEVEMENT',achievement)

    if(achievement.gallery?.length > 0){
        for(const img of achievement.gallery){
            console.log('IMG',img.publicId)
            await deleteFromCloudinary(img.publicId);
        }
    }

    const response = await Achievement.deleteOne({ achievementId });
    if (response.deletedCount === 0) {
        throw new ApiError(400, 'Cannot delete the achievement');
    }

    return res.status(200).json(new ApiResponse(200, null, 'Achievement deleted successfully'));
});

export const toggleStatus = asyncHandler(async (req, res) => {

    const {achievementId} = req.query;
    const {status} = req.query

    if(!achievementId || !status) throw new ApiError(400, 'Achievement ID and Status is required'); 

    const achievement = await Achievement.findOneAndUpdate({achievementId}, {status}, {new: true});
    if(!achievement) throw new ApiError(404, 'Achievement not found');
    return res.status(200).json(new ApiResponse(200, achievement, 'Achievement status updated successfully'));
})

export const updateAchievement = asyncHandler(async (req, res) => {

    const {achievementId} = req.params;
    if(!achievementId) throw new ApiError(400, 'Achievement ID is required');

    const achievement = await Achievement.findOne({achievementId});
    if(!achievement) throw new ApiError(404, 'Achievement not found');

    const { title, description, tags, socialMediaLinks } = req.body;

    if ([title, description].every(field => !field?.trim())) {
        throw new ApiError(400, "Required fields are missing");
    }


    const updatedAchievement = await Achievement.findOneAndUpdate({achievementId}, {
        title,
        description,
        tags,
        socialMediaLinks
    }, {new: true}).select('-_id -__v');

    if (!updatedAchievement) {
        
        throw new ApiError(400, 'Error in updating achievement');
    }

    return res.status(200).json(new ApiResponse(200, updatedAchievement, 'Achievement updated successfully'));
});