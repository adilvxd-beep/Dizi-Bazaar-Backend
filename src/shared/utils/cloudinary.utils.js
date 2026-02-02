import { cloudinary } from "../../config/index.js";

const normalizeFiles = (input) => {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((f) => f.buffer ?? f.path ?? f);
  }

  if (typeof input === "object") {
    return [input.buffer ?? input.path ?? input];
  }

  return [input];
};

export const uploadToCloudinary = async (files, options = {}) => {
  const { folder = "uploads", publicId, resourceType = "auto" } = options;

  const fileArray = normalizeFiles(files);

  try {
    const uploadPromises = fileArray.map((file, index) => {
      const uploadOptions = {
        folder,
        resource_type: resourceType,
      };

      if (publicId) {
        uploadOptions.public_id = Array.isArray(publicId)
          ? (publicId[index] ?? `${Date.now()}-${index}`)
          : publicId;
      }

      if (Buffer.isBuffer(file)) {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          stream.end(file);
        });
      }

      if (typeof file === "string") {
        return cloudinary.uploader.upload(file, uploadOptions);
      }

      throw new Error("Unsupported file type for Cloudinary upload");
    });

    const results = await Promise.all(uploadPromises);

    return results.map((file) => ({
      url: file.secure_url,
      publicId: file.public_id,
      resourceType: file.resource_type,
    }));
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload file(s) to Cloudinary");
  }
};

export const deleteFromCloudinary = async (
  publicIds,
  resourceType = "image",
) => {
  const ids = Array.isArray(publicIds) ? publicIds : [publicIds];

  try {
    return await Promise.all(
      ids.map((id) =>
        cloudinary.uploader.destroy(id, {
          resource_type: resourceType,
        }),
      ),
    );
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete file(s) from Cloudinary");
  }
};
