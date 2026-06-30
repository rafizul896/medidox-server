import express from "express";
import { PatientController } from "./patient.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { fileUploder } from "../../helper/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { updatePatientValidationSchema } from "./patient.validation";

const router = express.Router();

router.get("/", PatientController.getAllFromDB);

router.get("/:id", PatientController.getByIdFromDB);

router.patch(
  "/:id",
  auth(Role.PATIENT),
  fileUploder.upload.single("file"),
  validateRequest(updatePatientValidationSchema),
  PatientController.updateIntoDB,
);

router.delete(
  "/soft/:id",
  auth(Role.ADMIN, Role.PATIENT),
  PatientController.softDelete,
);

export const PatientRoutes = router;
