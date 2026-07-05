import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { MetaController } from "./metaData.controller";

const router = express.Router();

router.get(
  "/",
  auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  MetaController.fetchDashboardMetaData,
);

export const MetaRoutes = router;
