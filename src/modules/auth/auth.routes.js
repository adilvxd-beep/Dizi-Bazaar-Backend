import express from "express";
import {
  register,
  login,
  userSignupController,
  requestOtpController,
  verifyOtpController,
} from "./auth.controller.js";

const router = express.Router();

/* ================= NORMAL AUTH ================= */
router.post("/register", register);
router.post("/login", login);

/* ================= USER SELF SIGNUP (LITE) ================= */
router.post("/signup", userSignupController);

router.post("/request-otp", requestOtpController);
router.post("/verify-otp", verifyOtpController);


export default router;
