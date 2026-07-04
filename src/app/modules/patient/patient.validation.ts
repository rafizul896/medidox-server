import { z } from "zod";

// Patient update schema
export const updatePatientValidationSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    profilePhoto: z.string().url("Must be a valid URL").optional(),
    address: z
      .string()
      .min(3, "Address must be at least 3 characters")
      .optional(),
    contactNumber: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, "Contact number must be valid")
      .optional(),
    isDeleted: z.boolean().optional(),
  })
  .strict();

// PatientHealthData update schema
export const updatePatientHealthDataValidationSchema = z
  .object({
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .optional(),
    bloodGroup: z
      .enum([
        "A_POSITIVE",
        "B_POSITIVE",
        "O_POSITIVE",
        "AB_POSITIVE",
        "A_NEGATIVE",
        "B_NEGATIVE",
        "O_NEGATIVE",
        "AB_NEGATIVE",
      ])
      .optional(),
    hasAllergies: z.boolean().optional(),
    hasDiabetes: z.boolean().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    smokingStatus: z.boolean().optional(),
    dietaryPreferences: z.string().optional(),
    pregnancyStatus: z.boolean().optional(),
    mentalHealthHistory: z.string().optional(),
    immunizationStatus: z.string().optional(),
    hasPastSurgeries: z.boolean().optional(),
    recentAnxiety: z.boolean().optional(),
    recentDepression: z.boolean().optional(),
    maritalStatus: z.enum(["MARRIED", "UNMARRIED"]).optional(),
  })
  .strict();

// MedicalReport update schema
export const updateMedicalReportValidationSchema = z
  .object({
    reportName: z.string().min(1, "Report name is required").optional(),
    reportLink: z.string().url("Must be a valid URL").optional(),
  })
  .strict();

// Combined schema (optional)
export const updatePatientCombinedSchema = z
  .object({
    patientData: updatePatientValidationSchema.optional(),
    patientHealthData: updatePatientHealthDataValidationSchema.optional(),
    medicalReport: updateMedicalReportValidationSchema.optional(),
  })
  .strict();
