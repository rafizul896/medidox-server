import { NextFunction, Request, Response, Router } from "express";
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

router.get(
  "/me",
  auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  UserController.getMyProfile,
);

router.post(
  "/create-patient",
  fileUploder.upload.single("file"),
  validateRequest(UserValidation.createPatientValidationSchema),
  UserController.createPatient,
);

router.post(
  "/create-doctor",
  auth(Role.ADMIN),
  fileUploder.upload.single("file"),
  validateRequest(UserValidation.createDoctorValidationSchema),
  UserController.createDoctor,
);

router.post(
  "/create-admin",
  auth(Role.ADMIN),
  fileUploder.upload.single("file"),
  validateRequest(UserValidation.createAdminValidationSchema),
  UserController.createAdmin,
);

router.patch(
  "/:id/status",
  auth(Role.ADMIN),
  validateRequest(UserValidation.updateStatus),
  UserController.changeProfileStatus,
);

router.patch(
  "/update-my-profile",
  auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  fileUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfie(req, res, next);
  },
);

export const userRoutes = router;
