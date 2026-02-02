// shared/helpers/cloudinary.helper.js
export const extractPublicId = (url) => {
  const parts = url.split("/");
  const file = parts.at(-1);
  const folder = parts.at(-2);
  return `${folder}/${file.split(".")[0]}`;
};
