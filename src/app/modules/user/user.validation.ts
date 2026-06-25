import z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  patient: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    profilePhoto: z.string().url("Must be a valid URL").optional(),
    address: z.string().optional(),
    isDeleted: z.boolean().optional().default(false),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  doctor: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    profilePhoto: z.string().url("Must be a valid URL").optional(),
    contactNumber: z.string().min(7, "Contact number must be valid"),
    address: z.string().optional(),
    registrationNumber: z.string().min(1, "Registration number is required"),
    experience: z.number().int().nonnegative().default(0),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    appointmentFee: z.number().int().positive("Fee must be positive"),
    qualification: z.string().min(1, "Qualification is required"),
    currentWorkingPlace: z.string().min(1, "Current working place is required"),
    designation: z.string().min(1, "Designation is required"),
    isDeleted: z.boolean().optional().default(false),
  }),
});


export const UserValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema
};
