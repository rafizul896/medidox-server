import { UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../../prisma/prisma";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { generateToken, verifyToken } from "../../helper/generateToken";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { sendEmail } from "../../helper/sendEmail";
import { JwtPayload } from "jsonwebtoken";

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

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.JWT.JWT_REFRESH_SECRET as string);
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES as string,
  );

  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.JWT.JWT_REFRESH_SECRET as string,
    config.JWT.JWT_REFRESH_EXPIRES as string,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT_ROUND),
  );

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = generateToken(
    { email: userData.email, userId: userData.id, role: userData.role },
    config.RESET.RESET_PASS_TOKEN as string,
    config.RESET.RESET_PASS_TOKEN_EXPIRES_IN as string,
  );

  const resetUrl =
    config.RESET.RESET_PASS_LINK +
    `?email=${encodeURIComponent(userData.email)}&token=${resetPassToken}`;

    // http://localhost:3000/reset-password?email=rafizulislam899%40gmail.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhZml6dWxpc2xhbTg5OUBnbWFpbC5jb20iLCJ1c2VySWQiOiIxOGQ0MDM1Zi1jMTFjLTQ2NDgtOGRlZi01YzU1ZDY0NmFkMjMiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc4MzMwMzM3MSwiZXhwIjoxNzgzMzAzNjcxfQ.7N9ufwIepdh-a9e_vYL52LMjLtwtaZ9YaPD531_qZgU

  await sendEmail({
    to: userData.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      resetUrl,
    },
  });
};

const resetPassword = async (
  token: string | null,
  payload: { email?: string; password: string },
  user: JwtPayload,
) => {
  let userEmail: string;

  // Case 1: Token-based reset (from forgot password email)
  if (token) {
    const decodedToken = verifyToken(
      token,
      config.RESET.RESET_PASS_TOKEN as string,
    );

    if (!decodedToken) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Invalid or expired reset token!",
      );
    }

    // Verify email from token matches the email in payload
    if (payload.email && decodedToken.email !== payload.email) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Email mismatch! Invalid reset request.",
      );
    }

    userEmail = decodedToken.email;
  }

  // Case 2: Authenticated user with needPasswordChange (newly created admin/doctor)
  else if (user && user.email) {
    console.log({ user }, "needpassworchange");
    const authenticatedUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
        status: UserStatus.ACTIVE,
      },
    });

    // Verify user actually needs password change
    if (!authenticatedUser.needPasswordChange) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You don't need to reset your password. Use change password instead.",
      );
    }

    userEmail = user.email;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid request. Either provide a valid token or be authenticated.",
    );
  }

  // hash password
  const password = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND),
  );

  // update into database
  await prisma.user.update({
    where: {
      email: userEmail,
    },
    data: {
      password,
      needPasswordChange: false,
    },
  });
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
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
