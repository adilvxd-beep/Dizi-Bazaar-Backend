import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be at most 10 digits")
    .regex(
      /^\+?[0-9]+$/,
      "Phone number must contain only digits and may start with +",
    ),
  otp: z.string().length(4, "OTP must be exactly 4 digits"),
});

export const requestOtpSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be at most 10 digits")
    .regex(
      /^\+?[0-9]+$/,
      "Phone number must contain only digits and may start with +",
    ),
});
