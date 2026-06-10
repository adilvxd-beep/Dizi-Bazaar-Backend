import {
  createUser,
  findUserByPhone,
  userSignupRepo,
  findUserById,
} from "./auth.repository.js";

import { generateToken } from "../../shared/utils/jwtToken.js";

import { findWholesalerByUserId, getWholesalerBankDetailsFromWholesaler } from "../wholesaler/userWholesaler/wholesalerUserWholesaler.repository.js";
import { findRetailerProfileByUserId } from "../retailer/profile/retailer.profile.repository.js";
import { findAgentProfileById } from "../agent/profile/agent.profile.repository.js";

/* =========================
   GET ME (PROFILE)
========================= */
export const getMeService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
};

/* =========================
   GET FULL PROFILE
========================= */
export const getFullProfileService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  let profileData = {};
  
  if (user.role === "wholesaler") {
    const wholesalerData = await findWholesalerByUserId(userId);
    let bankDetails = null;
    try {
      bankDetails = await getWholesalerBankDetailsFromWholesaler({ id: userId });
    } catch (error) {
      // bank details might not exist
    }
    profileData = { ...wholesalerData, bankDetails };
  } else if (user.role === "retailer") {
    profileData = await findRetailerProfileByUserId(userId);
  } else if (user.role === "agent") {
    profileData = await findAgentProfileById(userId);
  }

  return {
    ...user,
    profile: profileData || null
  };
};

/* =========================
   REGISTER (NON-OTP FLOW)
========================= */
export const registerUser = async (userData) => {
  const { username, phone, role } = userData;

  const newUser = await createUser({
    username,
    phone,
    role,
  });

  return newUser;
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (userData) => {
  const { phone, otp } = userData;

  if (!phone || !otp) {
    throw new Error("PHONE_AND_OTP_REQUIRED");
  }

  /* =========================
     MOCK OTP VERIFICATION
  ========================= */
  if (otp !== "1111") {
    throw new Error("INVALID_OTP");
  }

  /* =========================
     FIND USER
  ========================= */
  const user = await findUserByPhone(phone);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  /* =========================
     GENERATE TOKEN
  ========================= */
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      phone: user.phone,
      role: user.role,
    },
  };
};

/* =========================
   DIRECT SIGNUP (IF USED)
========================= */
export const userSignupService = async (data) => {
  try {
    return await userSignupRepo(data);
  } catch (error) {
    if (error.message === "USER_ALREADY_EXISTS") {
      error.statusCode = 409;
      throw error;
    }

    if (error.message === "MISSING_REQUIRED_FIELDS") {
      error.statusCode = 400;
      throw error;
    }

    if (error.code === "23503") {
      const err = new Error("INVALID_BUSINESS_CATEGORY");
      err.statusCode = 400;
      throw err;
    }

    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

/* =========================
   VERIFY OTP + SIGNUP
========================= */
export const verifyOtpAndSignupService = async (data) => {
  const { otp, phone, businessCategoryId, role } = data;

  if (!otp) {
    throw new Error("OTP_REQUIRED");
  }

  // MOCK OTP
  if (otp !== "1111") {
    throw new Error("INVALID_OTP");
  }

  // Generate random username: role + 3 digits + 1 alphabet
  const generateUsername = (role) => {
    const digits = Math.floor(100 + Math.random() * 900); // 3 digits
    const alphabet = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
    return `${role}${digits}${alphabet}`;
  };

  const username = generateUsername(role);

  // OTP valid → create user
  const user = await userSignupRepo({
    username,
    phone,
    businessCategoryId,
    role,
  });

  // OPTIONAL: auto-login after signup
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
    user,
    token,
  };
};
