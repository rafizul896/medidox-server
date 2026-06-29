import z from "zod";

const doctorScheduleValidationSchema = z.object({
  scheduleIds: z
    .array(z.string().uuid("Each scheduleId must be a valid UUID"))
    .nonempty("At least one scheduleId is required"),
});

export const DoctorScheduleValidation = {
  doctorScheduleValidationSchema,
};
