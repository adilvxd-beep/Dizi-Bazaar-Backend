import express from "express";

import {
  getJobPosts,
  getJobPostById,
  createJobPost,
  updateJobPost,
  deleteJobPost,
  updateJobPostStatus,
  getJobPostsByStatus,
  searchJobPosts,
} from "./controller.js";

import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

/* ==================== JOB POSTS ROUTES (ADMIN) ==================== */

// Get all job posts
router.get("/", authenticate, authorize(ROLES.ADMIN), getJobPosts);

// Search job posts
router.get("/search", authenticate, authorize(ROLES.ADMIN), searchJobPosts);

// Get job posts by status
router.get(
  "/status/:status",
  authenticate,
  authorize(ROLES.ADMIN),
  getJobPostsByStatus,
);

// Get job post by ID
router.get("/:id", authenticate, authorize(ROLES.ADMIN), getJobPostById);

// Create job post
router.post("/", authenticate, authorize(ROLES.ADMIN), createJobPost);

// Update job post
router.put("/:id", authenticate, authorize(ROLES.ADMIN), updateJobPost);

// Update / toggle job post status
router.patch(
  "/:id/status",
  authenticate,
  authorize(ROLES.ADMIN),
  updateJobPostStatus,
);

// Delete job post
router.delete("/:id", authenticate, authorize(ROLES.ADMIN), deleteJobPost);

export default router;
