// media.controller.js
import * as mediaService from "./media.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const uploadAndDelete = async (req, res) => {
  let deleteUrls = [];

  if (req.body.deleteUrls) {
    try {
      deleteUrls = JSON.parse(req.body.deleteUrls);
    } catch {
      return res.status(400).json({
        message: "deleteUrls must be a valid JSON array",
      });
    }
  }

  const result = await mediaService.handleMedia({
    files: req.files || req.file,
    deleteUrls,
  });

  res.json(result);
};
