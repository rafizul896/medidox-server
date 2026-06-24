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

export const UserValidation = {
  createPatientValidationSchema,
};
