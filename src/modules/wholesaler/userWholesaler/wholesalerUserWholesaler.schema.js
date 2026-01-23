import { z } from "zod";

export const createWholesalerSchema = z.object({
  businessName: z.string().min(1),
  ownerName: z.string().min(1),
  alternatePhoneNumber: z.string().optional(),
  email: z.string().email(),
  websiteUrl: z.string().url().optional(),
  businessAddress: z.string().min(1),
  billingAddress: z.string().min(1),
  gstNumber: z.string().min(1),
  panNumber: z.string().min(1),
  aadharNumber: z.string().min(1),
  msmeNumber: z.string().optional(),
  yearsInBusiness: z.number().int().min(0),
  numberOfEmployees: z.number().int().min(0),
  annualTurnover: z.number().min(0),
  tradeLicenseNumber: z.string().min(1)
});
