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

router.get(
  "/",
  auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  DoctorScheduleController.getAllFromDB,
);

router.get(
  "/my-schedule",
  auth(Role.DOCTOR),
  DoctorScheduleController.getMySchedule,
);

router.delete("/:id", auth(Role.DOCTOR), DoctorScheduleController.deleteFromDB);

export const doctorScheduleRoutes = router;
