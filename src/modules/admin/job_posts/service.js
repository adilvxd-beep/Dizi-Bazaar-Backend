import {
  createJobPost,
  findJobPostById,
  findAllJobPosts,
  updateJobPostById,
  deleteJobPostById,
  updateJobPostStatus,
  findJobPostsByStatus,
  searchJobPosts,
} from "./repository.js";

// ==================== HELPER FUNCTIONS ====================

function normalizeText(value) {
  if (!value) return value;
  return value.trim();
}

function normalizeEmail(email) {
  if (!email) return email;
  return email.trim().toLowerCase();
}

function validateJobPostData(data, isUpdate = false) {
  const {
    title,
    department,
    location,
    type,
    description,
    requirements,
    contact_email,
  } = data;

  if (!isUpdate) {
    if (!title || !title.trim()) {
      throw new Error("Job title is required");
    }

    if (!department || !department.trim()) {
      throw new Error("Department is required");
    }

    if (!location || !location.trim()) {
      throw new Error("Location is required");
    }

    if (!type || !type.trim()) {
      throw new Error("Job type is required");
    }

    if (!description || !description.trim()) {
      throw new Error("Job description is required");
    }

    if (!requirements || !requirements.trim()) {
      throw new Error("Job requirements are required");
    }

    if (!contact_email || !contact_email.trim()) {
      throw new Error("Contact email is required");
    }
  }
}

// ==================== JOB POSTS SERVICES ====================

// Create Job Post
export const createJobPostService = async (jobData) => {
  validateJobPostData(jobData);

  const payload = {
    ...jobData,
    title: normalizeText(jobData.title),
    department: normalizeText(jobData.department),
    location: normalizeText(jobData.location),
    type: normalizeText(jobData.type),
    experience: normalizeText(jobData.experience),
    description: normalizeText(jobData.description),
    requirements: normalizeText(jobData.requirements),
    benefits: normalizeText(jobData.benefits),
    skills: normalizeText(jobData.skills),
    contact_email: normalizeEmail(jobData.contact_email),
  };

  return await createJobPost(payload);
};

// Get Job Post by ID
export const getJobPostByIdService = async (id) => {
  const job = await findJobPostById(id);

  if (!job) {
    throw new Error("Job post not found");
  }

  return job;
};

// Get All Job Posts (Admin)
export const getAllJobPostsService = async () => {
  return await findAllJobPosts();
};

// Update Job Post
export const updateJobPostService = async (id, jobData) => {
  validateJobPostData(jobData, true);

  const existingJob = await findJobPostById(id);
  if (!existingJob) {
    throw new Error("Job post not found");
  }

  const payload = {
    ...existingJob,
    ...jobData,
    title: normalizeText(jobData.title ?? existingJob.title),
    department: normalizeText(jobData.department ?? existingJob.department),
    location: normalizeText(jobData.location ?? existingJob.location),
    type: normalizeText(jobData.type ?? existingJob.type),
    experience: normalizeText(jobData.experience ?? existingJob.experience),
    description: normalizeText(jobData.description ?? existingJob.description),
    requirements: normalizeText(
      jobData.requirements ?? existingJob.requirements,
    ),
    benefits: normalizeText(jobData.benefits ?? existingJob.benefits),
    skills: normalizeText(jobData.skills ?? existingJob.skills),
    contact_email: normalizeEmail(
      jobData.contact_email ?? existingJob.contact_email,
    ),
  };

  return await updateJobPostById(id, payload);
};

// Delete Job Post
export const deleteJobPostService = async (id) => {
  const deleted = await deleteJobPostById(id);

  if (!deleted) {
    throw new Error("Job post not found");
  }

  return deleted;
};

// Toggle / Update Job Status
export const updateJobPostStatusService = async (id, status) => {
  if (!status) {
    throw new Error("Status is required");
  }

  const updated = await updateJobPostStatus(id, status);

  if (!updated) {
    throw new Error("Job post not found");
  }

  return updated;
};

// Get Job Posts by Status
export const getJobPostsByStatusService = async (status) => {
  if (!status) {
    throw new Error("Status is required");
  }

  return await findJobPostsByStatus(status);
};

// Search Job Posts (Admin)
export const searchJobPostsService = async (search) => {
  if (!search || !search.trim()) {
    return [];
  }

  return await searchJobPosts(search.trim());
};
