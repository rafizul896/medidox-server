import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post("/", ScheduleController.createSchedule);
router.get("/", ScheduleController.schedulesForDoctor);
router.delete("/:id", ScheduleController.deleteScheduleFromDB);

export const scheduleRoutes = router;
