import { z } from "zod";

export const createReviewValidationSchema = z.object({
  appointmentId: z.string({
    error: "Appointment Id is required",
  }),
  rating: z.number({
    error: "Rating is required",
  }),
  comment: z.string({
    error: "Comment is required",
  }),
});


