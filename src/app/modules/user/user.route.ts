import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploder } from "../../helper/fileUploader";

const router = Router();

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


export const userRoutes = router;
