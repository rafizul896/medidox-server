import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { fileUploder } from "../../helper/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { updateDoctorValidationSchema } from "./doctor.validation";

const router = Router();

router.get("/", DoctorController.getAllFromDB);

router.patch(
  "/:id",
  fileUploder.upload.single("file"),
  validateRequest(updateDoctorValidationSchema),
  DoctorController.updateIntoDB,
);

router.patch("/specialty/:id", DoctorController.doctorSpecialties);

export const DoctorRoutes = router;
