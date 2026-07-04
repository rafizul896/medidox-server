import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createReviewValidationSchema } from "./review.validation";
import { Role } from "../../../../generated/prisma/enums";
import { ReviewController } from "./review.controller";

const router = Router();

router.get("/", ReviewController.getAllFromDB);

router.post(
  "/",
  auth(Role.PATIENT),
  validateRequest(createReviewValidationSchema),
  ReviewController.insertIntoDB,
);

export const ReviewRoutes = router;
