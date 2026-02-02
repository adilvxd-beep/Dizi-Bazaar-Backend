// media.controller.js
import * as mediaService from "./media.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const uploadAndDelete = async (req, res, next) => {
  try {
    let deleteUrls = [];
    let uploadOptions = {};

    if (req.body?.deleteUrls) {
      try {
        deleteUrls = Array.isArray(req.body.deleteUrls)
          ? req.body.deleteUrls
          : JSON.parse(req.body.deleteUrls);
      } catch {
        throw new ApiError(400, "Invalid deleteUrls format");
      }
    }

    if (req.body?.uploadOptions) {
      try {
        uploadOptions =
          typeof req.body.uploadOptions === "string"
            ? JSON.parse(req.body.uploadOptions)
            : req.body.uploadOptions;
      } catch {
        throw new ApiError(400, "Invalid uploadOptions format");
      }
    }

    const result = await mediaService.handleMedia({
      files: req.files ?? req.file ?? null,
      deleteUrls,
      uploadOptions,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Media processed successfully"));
  } catch (error) {
    next(error);
  }
};
