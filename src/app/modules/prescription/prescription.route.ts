import { Router } from "express";
import auth from "../../middlewares/auth";
import { PrescriptionController } from "./prescription.controller";
import { Role } from "../../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { prescriptionValidationSchema } from "./prescription.validation";

const router = Router();

router.get(
  "/my-prescription",
  auth(Role.PATIENT),
  PrescriptionController.patientPrescription,
);

router.post(
  "/",
  validateRequest(prescriptionValidationSchema),
  auth(Role.DOCTOR),
  PrescriptionController.createPrescription,
);

export const PrescriptionRoutes = router;
