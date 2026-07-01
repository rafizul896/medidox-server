import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { fileUploder } from "../../helper/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { updateDoctorValidationSchema } from "./doctor.validation";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.get("/", DoctorController.getAllFromDB);

router.get("/suggestion", DoctorController.getAISuggestions)

router.get("/:id", DoctorController.getByIdFromDB);

router.patch(
  "/:id",
  auth(Role.DOCTOR),
  fileUploder.upload.single("file"),
  validateRequest(updateDoctorValidationSchema),
  DoctorController.updateIntoDB,
);

router.patch(
  "/specialty/:id",
  auth(Role.DOCTOR),
  DoctorController.doctorSpecialties,
);

router.delete(
  "/soft/:id",
  auth(Role.ADMIN, Role.DOCTOR),
  DoctorController.softDelete,
);

export const DoctorRoutes = router;
