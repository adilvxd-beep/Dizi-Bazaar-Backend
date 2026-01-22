import { z } from "zod";

/* ================= ENUM ================= */
export const verificationStatus = z.enum([
  "pending",
  "under_review",
  "verified",
  "rejected",
]);

export const documentStatus = verificationStatus;



/* ================= STAGE 1 CREATE ================= */
export const createWholesalerSchema = z.object({
  user: z.object({
    username: z.string().min(3),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9][0-9]{9}$/),
  }),

  wholesaler: z.object({
    businessName: z.string().min(3),
    businessCategoryId: z.number(),
    ownerName: z.string().min(3),
    businessAddress: z.string().min(5),

    alternatePhoneNumber: z.string().optional(),
    websiteUrl: z.string().optional(),

    gstNumber: z.string().optional(),
    panNumber: z.string().optional(),
    aadharNumber: z.string().optional(),
    msmeNumber: z.string().optional(),

    yearsInBusiness: z.number().optional(),
    numberOfEmployees: z.number().optional(),
    annualTurnover: z.number().optional(),

    tradeLicenseNumber: z.string().optional(),
  }),
});

/* ================= STAGE 2 DOCUMENT UPLOAD ================= */
export const createWholesalerDocumentsSchema = z.object({
  gstCertificateUrl: z.string().url().optional(),
  panCardUrl: z.string().url().optional(),
  aadharCardUrl: z.string().url().optional(),
  bankStatementUrl: z.string().url().optional(),
  businessProofUrl: z.string().url().optional(),
  cancelledChequeUrl: z.string().url().optional(),
});

/* ================= STAGE 3 VERIFICATION ================= */
export const verifyWholesalerSchema = z.object({
  status: verificationStatus,
  initialCreditLimit: z.number().min(0).optional(),
  adminNote: z.string().max(500).optional(),
});

/* ================= MANUAL WHOLESALER STATUS UPDATE ================= */
export const updateWholesalerStatusSchema = z.object({
  status: verificationStatus,
});

/* ================= MANUAL DOCUMENT STATUS UPDATE ================= */
export const updateWholesalerDocumentsStatusSchema = z
  .object({
    gst_certificate_status: documentStatus.optional(),
    pan_card_status: documentStatus.optional(),
    aadhar_card_status: documentStatus.optional(),
    bank_statement_status: documentStatus.optional(),
    business_proof_status: documentStatus.optional(),
    cancelled_cheque_status: documentStatus.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one document status must be provided",
  });


  /* ================= EDIT WHOLESALER (BASIC + DOCUMENTS) ================= */
export const editWholesalerBasicAndDocumentsSchema = z
  .object({
    user: z
      .object({
        username: z.string().min(3).optional(),
        email: z.string().email().optional(),
        phone: z.string().regex(/^[6-9][0-9]{9}$/).optional(),
      })
      .optional(),

    wholesaler: z
      .object({
        businessName: z.string().min(3).optional(),
        businessCategoryId: z.number().optional(),
        ownerName: z.string().min(3).optional(),
        businessAddress: z.string().min(5).optional(),
        billingAddress: z.string().min(5).optional(),

        alternatePhoneNumber: z.string().optional(),
        websiteUrl: z.string().optional(),

        gstNumber: z.string().optional(),
        panNumber: z.string().optional(),
        aadharNumber: z.string().optional(),
        msmeNumber: z.string().optional(),

        yearsInBusiness: z.number().optional(),
        numberOfEmployees: z.number().optional(),
        annualTurnover: z.number().optional(),

        tradeLicenseNumber: z.string().optional(),
      })
      .optional(),

    documents: z
      .object({
        gstCertificateUrl: z.string().url().optional(),
        panCardUrl: z.string().url().optional(),
        aadharCardUrl: z.string().url().optional(),
        bankStatementUrl: z.string().url().optional(),
        businessProofUrl: z.string().url().optional(),
        cancelledChequeUrl: z.string().url().optional(),
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.user || data.wholesaler || data.documents,
    {
      message:
        "At least one of user, wholesaler, or documents must be provided",
    }
  );
