import { z } from "zod";

export const createWholesalerSchema = z.object({
  businessName: z.string().min(3),
  businessCategoryId: z.number(),

  ownerName: z.string().min(3),

  phoneNumber: z.string().regex(/^[6-9][0-9]{9}$/),
  alternatePhoneNumber: z.string().optional(),

  email: z.string().email(),
  websiteUrl: z.string().url().optional(),

  businessAddress: z.string().min(5),
  billingAddress: z.string().optional(),

  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  aadharNumber: z.string().optional(),
  msmeNumber: z.string().optional(),

  yearsInBusiness: z.number().int().min(0).optional(),
  numberOfEmployees: z.number().int().min(0).optional(),
  annualTurnover: z.number().min(0).optional(),

  tradeLicenseNumber: z.string().optional()
});

export const updateWholesalerDocumentsSchema = z.object({
  gst_certificate_url: z.string().url().optional(),
  gst_certificate_status: z.enum([
    "pending",
    "under_review",
    "verified",
    "rejected"
  ]).optional(),

  pan_card_url: z.string().url().optional(),
  pan_card_status: z.enum([
    "pending",
    "under_review",
    "verified",
    "rejected"
  ]).optional(),

  aadhar_card_url: z.string().url().optional(),
  aadhar_card_status: z.enum([
    "pending",
    "under_review",
    "verified",
    "rejected"
  ]).optional(),

  bank_statement_url: z.string().url().optional(),
  bank_statement_status: z.enum([
    "pending",
    "under_review",
    "verified",
    "rejected"
  ]).optional(),

  business_proof_url: z.string().url().optional(),
  business_proof_status: z.enum([
    "pending",
    "under_review",
    "verified",
    "rejected"
  ]).optional(),

  cancelled_cheque_url: z.string().url().optional(),
  cancelled_cheque_status: z.enum([
    "pending",
    "under_review",
    "verified",
    "rejected"
  ]).optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one document field must be provided" }
);
