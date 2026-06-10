import * as retailerProfileRepository from "./retailer.profile.repository.js";

export const getRetailerProfile = async (userId) => {
  return await retailerProfileRepository.findRetailerProfileByUserId(userId);
};

export const updateRetailerProfile = async (userId, profileData) => {
  let profile = await retailerProfileRepository.findRetailerProfileByUserId(userId);
  
  if (!profile) {
    // If somehow the profile doesn't exist yet, create it
    return await retailerProfileRepository.createRetailerProfile(userId, profileData);
  }
  
  return await retailerProfileRepository.updateRetailerProfile(userId, profileData);
};
