import {
  getAllJobPostsService,
  getJobPostByIdService,
  createJobPostService,
  updateJobPostService,
  deleteJobPostService,
  updateJobPostStatusService,
  getJobPostsByStatusService,
  searchJobPostsService,
} from "./service.js";

import ApiError from "../../../shared/utils/ApiError.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

/* ==================== JOB POSTS CONTROLLERS ==================== */

// Get All Job Posts (Admin)
export const getJobPosts = async (req, res, next) => {
  try {
    const jobs = await getAllJobPostsService(req.query);
    res.json(new ApiResponse(200, jobs));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

// Get Job Post by ID
export const getJobPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await getJobPostByIdService(id);
    res.json(new ApiResponse(200, job));
  } catch (error) {
    next(new ApiError(404, error.message));
  }
};

// Create Job Post
export const createJobPost = async (req, res, next) => {
  try {
    const job = await createJobPostService(req.body);
    res.json(new ApiResponse(201, job, "Job post created successfully"));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

// Update Job Post
export const updateJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await updateJobPostService(id, req.body);
    res.json(new ApiResponse(200, job, "Job post updated successfully"));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

// Delete Job Post
export const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await deleteJobPostService(id);
    res.json(new ApiResponse(200, job, "Job post deleted successfully"));
  } catch (error) {
    next(new ApiError(404, error.message));
  }
};

// Update / Toggle Job Status
export const updateJobPostStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const job = await updateJobPostStatusService(id, status);
    res.json(new ApiResponse(200, job, "Job post status updated successfully"));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

// Get Job Posts by Status
export const getJobPostsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const jobs = await getJobPostsByStatusService(status);
    res.json(new ApiResponse(200, jobs));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

// Search Job Posts
export const searchJobPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const jobs = await searchJobPostsService(q);
    res.json(new ApiResponse(200, jobs));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};
