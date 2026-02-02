// media.service.js
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../shared/utils/cloudinary.utils.js";
import { extractPublicId } from "../../shared/helpers/cloudinary.helper.js";

export const handleMedia = async ({ files, deleteUrls }) => {
  const uploaded = [];
  const deleted = [];

  if (files) {
    uploaded.push(...(await uploadToCloudinary(files)));
  }

  if (deleteUrls.length) {
    const publicIds = deleteUrls.map(extractPublicId);
    await deleteFromCloudinary(publicIds);
    deleted.push(...publicIds);
  }

  return {
    uploaded,
    deleted,
  };
};
