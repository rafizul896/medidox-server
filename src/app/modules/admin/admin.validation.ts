import z from "zod";

export const updateAdminValidationSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  profilePhoto: z.string().url("Must be a valid URL").optional(),
  contactNumber: z.string().min(7, "Contact number must be valid").optional(),
  isDeleted: z.boolean().optional(),
});
