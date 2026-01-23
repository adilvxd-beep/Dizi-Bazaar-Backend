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

export const updateWholesalerSchema = z.object({
  /* =========================
     BASIC DETAILS
  ========================= */
  businessName: z.string().min(2).optional(),
  ownerName: z.string().min(2).optional(),

  alternatePhoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Invalid phone number")
    .optional(),

  email: z.string().email().optional(),
  websiteUrl: z.string().url().optional(),

  businessAddress: z.string().min(5).optional(),
  billingAddress: z.string().min(5).optional(),

  gstNumber: z.string().min(5).optional(),
  panNumber: z.string().min(5).optional(),
  aadharNumber: z.string().min(12).optional(),
  msmeNumber: z.string().optional(),

  yearsInBusiness: z.number().int().min(0).optional(),
  numberOfEmployees: z.number().int().min(0).optional(),
  annualTurnover: z.number().min(0).optional(),

  tradeLicenseNumber: z.string().min(3).optional(),

  /* =========================
     DOCUMENT URLs
  ========================= */
  gstCertificateUrl: z.string().url().optional(),
  panCardUrl: z.string().url().optional(),
  aadharCardUrl: z.string().url().optional(),
  bankStatementUrl: z.string().url().optional(),
  businessProofUrl: z.string().url().optional(),
  cancelledChequeUrl: z.string().url().optional()
}).strict();