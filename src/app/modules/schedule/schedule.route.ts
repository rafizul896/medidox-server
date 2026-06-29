import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  auth(Role.DOCTOR, Role.ADMIN),
  ScheduleController.schedulesForDoctor,
);

router.post("/", ScheduleController.createSchedule);

router.delete("/:id", ScheduleController.deleteScheduleFromDB);

export const scheduleRoutes = router;
