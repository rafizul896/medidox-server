import express from "express";
import { PatientController } from "./patient.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = express.Router();

router.get("/", PatientController.getAllFromDB);

router.get("/:id", PatientController.getByIdFromDB);

router.delete(
  "/soft/:id",
  auth(Role.ADMIN, Role.PATIENT),
  PatientController.softDelete,
);

export const PatientRoutes = router;
