import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploder } from "../../helper/fileUploader";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  UserController.getAllFromDB,
);

// create routes
router.post(
  "/create-patient",
  fileUploder.upload.single("file"),
  validateRequest(UserValidation.createPatientValidationSchema),
  UserController.createPatient,
);

router.post(
  "/create-doctor",
  fileUploder.upload.single("file"),
  validateRequest(UserValidation.createDoctorValidationSchema),
  UserController.createDoctor,
);

router.post(
  "/create-admin",
  fileUploder.upload.single("file"),
  validateRequest(UserValidation.createAdminValidationSchema),
  UserController.createAdmin,
);

export const userRoutes = router;
