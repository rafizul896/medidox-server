import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { Role } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/login", AuthController.login);

router.get("/me", AuthController.getMe);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/change-password",
  auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  AuthController.changePassword,
);

router.post("/forgot-password", AuthController.forgotPassword);

router.post(
  "/reset-password",
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization && req.cookies.accessToken) {
      auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT)(req, res, next);
    } else {
      next();
    }
  },
  AuthController.resetPassword,
);

export const authRoutes = router;
