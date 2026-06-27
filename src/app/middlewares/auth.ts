import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helper/generateToken";
import config from "../../config";

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new Error("You are not authorized!");
      }

      const verifyUser = verifyToken(
        token,
        config.JWT.JWT_ACCESS_SECRET as string,
      );

      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new Error("You are not authorized!");
      }

      next();
    } catch (err) {
      next(err);
    }
  };

export default auth;
