import express from "express";
import {
  register,
  login,
  userSignupController,
  requestOtpController,
  verifyOtpController,
} from "./auth.controller.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { loginSchema, requestOtpSchema } from "./auth.schema.js";

const router = express.Router();

/* ================= NORMAL AUTH ================= */
router.post("/register", register);
router.post("/login", validate(loginSchema), login);

/* ================= USER SELF SIGNUP (LITE) ================= */
router.post("/signup", userSignupController);

router.post("/request-otp", validate(requestOtpSchema), requestOtpController);
router.post("/verify-otp", verifyOtpController);

export default router;
