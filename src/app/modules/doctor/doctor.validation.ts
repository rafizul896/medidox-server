import { z } from "zod";

export const updateDoctorValidationSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  profilePhoto: z.string().url("Must be a valid URL").optional(),
  contactNumber: z.string().min(7, "Contact number must be valid").optional(),
  address: z.string().optional(),
  registrationNumber: z.string().min(1, "Registration number is required").optional(),
  experience: z.number().int().nonnegative().optional(), 
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  appointmentFee: z.number().int().positive("Fee must be positive").optional(),
  qualification: z.string().min(1, "Qualification is required").optional(),
  currentWorkingPlace: z.string().min(1, "Current working place is required").optional(),
  designation: z.string().min(1, "Designation is required").optional(),
  isDeleted: z.boolean().optional(),
});

