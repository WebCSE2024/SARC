import { Project, SIG } from "./sig.model.js";
import { SIGType } from "../../../../../shared/types/user.type.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

export const getAllSIGs = asyncHandler(async (req, res) => {
  const sigs = await SIG.find({ isActive: true }).lean();

  return res
    .status(200)
    .json(new ApiResponse(200, sigs, "SIGs fetched successfully"));
});

export const getSIGById = asyncHandler(async (req, res) => {
  const { sigId } = req.params;

  if (!sigId || !Object.values(SIGType).includes(sigId)) {
    throw new ApiError(400, "Invalid SIG ID");
  }

  const sig = await SIG.findOne({ sigId, isActive: true }).lean();
  if (!sig) {
    throw new ApiError(404, "SIG not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sig, "SIG fetched successfully"));
});

export const getProjectsBySIG = asyncHandler(async (req, res) => {
  const { sigId } = req.params;
  const { year, limit = 50, skip = 0 } = req.query;

  if (!sigId || !Object.values(SIGType).includes(sigId)) {
    throw new ApiError(400, "Invalid SIG ID");
  }

  const filter = { sigId };
  if (year) {
    filter.year = year;
  }

  const projects = await Project.find(filter)
    .sort({ date: -1 })
    .skip(parseInt(skip, 10))
    .limit(parseInt(limit, 10))
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).lean();
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, date, year, sigId, media } = req.body;

  if (!title || !description || !date || !year || !sigId) {
    throw new ApiError(
      400,
      "Missing required fields: title, description, date, year, sigId"
    );
  }

  if (!Object.values(SIGType).includes(sigId)) {
    throw new ApiError(400, "Invalid SIG ID");
  }

  const projectData = {
    title,
    description,
    date: new Date(date),
    year,
    sigId,
  };

  if (media && media.type && media.url) {
    projectData.media = {
      type: media.type,
      url: media.url,
    };
  }

  const project = await Project.create(projectData);

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, date, year, sigId, media } = req.body;

  const existingProject = await Project.findById(projectId);
  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (date !== undefined) updateData.date = new Date(date);
  if (year !== undefined) updateData.year = year;
  if (sigId !== undefined) {
    if (!Object.values(SIGType).includes(sigId)) {
      throw new ApiError(400, "Invalid SIG ID");
    }
    updateData.sigId = sigId;
  }
  if (media !== undefined) {
    updateData.media = media;
  }

  const project = await Project.findByIdAndUpdate(projectId, updateData, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const existingProject = await Project.findById(projectId);
  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  await Project.findByIdAndDelete(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"));
});

export const getProjectYearsBySIG = asyncHandler(async (req, res) => {
  const { sigId } = req.params;

  if (!sigId || !Object.values(SIGType).includes(sigId)) {
    throw new ApiError(400, "Invalid SIG ID");
  }

  const years = await Project.distinct("year", { sigId });
  const sortedYears = years.sort().reverse();

  return res
    .status(200)
    .json(
      new ApiResponse(200, sortedYears, "Project years fetched successfully")
    );
});
