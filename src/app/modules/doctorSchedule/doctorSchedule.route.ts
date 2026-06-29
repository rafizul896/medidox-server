import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.post(
  "/",
  auth(Role.DOCTOR),
  validateRequest(DoctorScheduleValidation.doctorScheduleValidationSchema),
  DoctorScheduleController.createDoctorSchedule,
);

export const doctorScheduleRoutes = router;
