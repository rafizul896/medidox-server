import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";
import { fileUploder } from "../../helper/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { updateAdminValidationSchema } from "./admin.validation";

const router = Router();

router.get("/", auth(Role.ADMIN), AdminController.getAllFromDB);

router.get("/:id", auth(Role.ADMIN), AdminController.getByIdFromDB);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  fileUploder.upload.single("file"),
  validateRequest(updateAdminValidationSchema),
  AdminController.updateIntoDB,
);

router.delete("/soft/:id", auth(Role.ADMIN), AdminController.softDeleteFromDB);

export const AdminRoutes = router;
