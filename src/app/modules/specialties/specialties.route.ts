import { Router } from "express";
import { SpecialtiesController } from "./specialties.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { fileUploder } from "../../helper/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { SpecialtiesValidtaion } from "./specialties.validation";

const router = Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  fileUploder.upload.single("file"),
  validateRequest(SpecialtiesValidtaion.create),
  SpecialtiesController.inserIntoDB,
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.ADMIN),
  SpecialtiesController.deleteFromDB,
);

export const SpecialtiesRoutes = router;
