import express from "express";
import {
  register,
  login,
  signupWholesalerLiteController
} from "./auth.controller.js";

const router = express.Router();

/* ================= NORMAL AUTH ================= */
router.post("/register", register);
router.post("/login", login);

/* ================= WHOLESALER SELF SIGNUP (LITE) ================= */
router.post(
  "/wholesaler/signup",
  signupWholesalerLiteController
);

export default router;
