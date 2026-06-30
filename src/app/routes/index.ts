import express, { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";

const router = express.Router();

const moduleRoutes: { path: string; route: Router }[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoutes,
  },
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
