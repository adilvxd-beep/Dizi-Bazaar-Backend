// media.controller.js
import * as mediaService from "./media.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const uploadAndDelete = async (req, res, next) => {
  try {
    let deleteUrls = [];

    if (req.body.deleteUrls) {
      try {
        deleteUrls = JSON.parse(req.body.deleteUrls);
      } catch {
        throw new ApiError(400, "Invalid deleteUrls format");
      }
    }

    const result = await mediaService.handleMedia({
      files: req.files || req.file,
      deleteUrls,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Media processed successfully"));
  } catch (error) {
    next(error);
  }
};
