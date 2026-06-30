import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", auth(Role.ADMIN), AdminController.getAllFromDB);

export const AdminRoutes = router;
