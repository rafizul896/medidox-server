import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.get("/", auth(Role.ADMIN), AppointmentController.getAllFromDB);

router.get(
  "/my-appointments",
  auth(Role.PATIENT, Role.DOCTOR),
  AppointmentController.getMyAppointment,
);

router.post("/", auth(Role.PATIENT), AppointmentController.createAppointment);

router.patch(
  "/status/:id",
  auth(Role.ADMIN, Role.DOCTOR),
  AppointmentController.updateAppointmentStatus,
);

export const AppointmentRoutes = router;
