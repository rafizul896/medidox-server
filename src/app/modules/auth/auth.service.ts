import { UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../../prisma/prisma";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../../config";
import { generateToken } from "../../helper/generateToken";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isCorrectPassword) {
    throw new Error("Password is not correct");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken =  generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES as string,
  );

  const refreshToken =  generateToken(
    jwtPayload,
    config.JWT.JWT_REFRESH_SECRET as string,
    config.JWT.JWT_REFRESH_EXPIRES as string,
  );

  console.log(accessToken,refreshToken)

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange
  };
};

export const AuthService = {
  login,
};
