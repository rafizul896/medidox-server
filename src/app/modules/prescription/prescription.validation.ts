import z from "zod";

export const prescriptionValidationSchema = z.object({
  appointmentId: z.string("Invalid appointment ID format"),
  instructions: z.string().min(1, "Instructions are required"),
  followUpDate: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Follow-up date must be a valid date",
    )
    .optional(),
});
