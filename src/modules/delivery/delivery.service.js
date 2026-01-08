import {
  findAllDeliveries,
  updateDeliveryStatus as updateStatus,
} from "./delivery.repository.js";

export const getAllDeliveries = async () => {
  return await findAllDeliveries();
};

export const updateDeliveryStatus = async (id, data) => {
  const { status } = data;
  return await updateStatus(id, status);
};
