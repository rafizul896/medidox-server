import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req, res, next) => {
  const result = await AuthService.login(req.body);
  const { accessToken, refreshToken, needPasswordChange } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User login successfully",
    data: {
      needPasswordChange,
    },
  });
});

export const AuthController = {
  login,
};
