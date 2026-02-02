// media.route.js
import express from "express";
import { upload } from "../../shared/middlewares/upload.middleware.js";
import * as mediaController from "./media.controller.js";

const router = express.Router();

export default router;
router.post("/upload", upload.any(), mediaController.uploadAndDelete);
