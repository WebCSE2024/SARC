import Seminar from '../models/seminar.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

export const createSeminar = asyncHandler(async (req, res) => {
    // if (!req.user) throw new ApiError(400, 'Unauthenticated');
    
    const { title, speaker, date, time, venue } = req.body;
    if ([title, speaker, date, time, venue].some(field => !field)) {
        throw new ApiError(400, "Required fields are missing");
    }
    
    const newSeminar = await Seminar.create({
        title,
        speaker,
        date,
        time,
        venue
    });
    
    return res.status(200).json(new ApiResponse(200, newSeminar, 'Seminar created successfully'));
});

export const getAllSeminars = asyncHandler(async (req, res) => {
    const seminars = await Seminar.find();
    if (!seminars.length) throw new ApiError(400, 'No seminars found');
    return res.status(200).json(new ApiResponse(200, seminars, 'Seminars fetched successfully'));
});

export const getSeminarDetails = asyncHandler(async (req, res) => {
    const { seminarId } = req.params;
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) throw new ApiError(404, 'Seminar not found');
    return res.status(200).json(new ApiResponse(200, seminar, 'Seminar details fetched successfully'));
});

export const updateSeminar = asyncHandler(async (req, res) => {
    const { seminarId } = req.params;
    const updatedData = req.body;
    
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) throw new ApiError(404, 'Seminar not found');
    
    const updatedSeminar = await Seminar.findByIdAndUpdate(seminarId, updatedData, { new: true });
    return res.status(200).json(new ApiResponse(200, updatedSeminar, 'Seminar updated successfully'));
});

export const deleteSeminar = asyncHandler(async (req, res) => {
    const { seminarId } = req.params;
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) throw new ApiError(404, 'Seminar not found');
    
    await Seminar.deleteOne({ _id: seminarId });
    return res.status(200).json(new ApiResponse(200, null, 'Seminar deleted successfully'));
});