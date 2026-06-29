import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.DOCTOR),
  DoctorScheduleController.createDoctorSchedule,
);

export const doctorScheduleRoutes = router;
