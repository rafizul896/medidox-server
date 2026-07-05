import { UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../../prisma/prisma";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { generateToken, verifyToken } from "../../helper/generateToken";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

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
    throw new AppError(httpStatus.BAD_REQUEST, "Password is not correct");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES as string,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.JWT.JWT_REFRESH_SECRET as string,
    config.JWT.JWT_REFRESH_EXPIRES as string,
  );

  console.log(accessToken, refreshToken);

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const getMe = async (user: any) => {
  const accessToken = user.accessToken;
  const decodedData = verifyToken(
    accessToken,
    config.JWT.JWT_ACCESS_SECRET as string,
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          averageRating: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          doctorSpecialties: {
            include: {
              specialties: true,
            },
          },
        },
      },
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          patientHealthData: true,
        },
      },
    },
  });

  return userData;
};

export const AuthService = {
  login,
  getMe,
};
