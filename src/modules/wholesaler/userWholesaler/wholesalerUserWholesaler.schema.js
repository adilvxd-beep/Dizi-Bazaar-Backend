import { z } from "zod";

const optStr = z.string().optional().or(z.literal(""));

export const createWholesalerSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Valid email is required"),

  ownerName: optStr,
  alternatePhoneNumber: optStr,
  websiteUrl: z.string().url().optional().or(z.literal("")),
  businessAddress: optStr,
  billingAddress: optStr,
  
  tradeLicenseNumber: optStr,
  msmeNumber: optStr,

  yearsInBusiness: z.number().optional(),
  numberOfEmployees: z.number().optional(),
  annualTurnover: z.number().optional(),
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

/* ================= UPDATE WHOLESALER BANK DETAILS ================= */
export const updateWholesalerBankDetailsSchema = z
  .object({
    bankName: z.string().min(2).optional(),

    accountHolderName: z.string().min(2).optional(),

    accountNumber: z.string().min(6).optional(),

    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
      .optional(),

    upiId: z.string().optional(),

    accountType: z.enum([
      "saving",
      "current",
      "cash credit",
      "overdraft",
      "loan",
    ]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one bank detail field must be provided",
  });