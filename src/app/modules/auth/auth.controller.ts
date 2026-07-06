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

const refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  const tokenInfo = await AuthService.refreshToken(refreshToken);

  res.cookie("accessToken", tokenInfo.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New access token retrived successfully",
    data: tokenInfo,
  });
});

const getMe = catchAsync(async (req, res, next) => {
  const session = req.cookies;
  const result = await AuthService.getMe(session);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrived successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const user = req.user;

  const result = await AuthService.changePassword(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Changed successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your email!",
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log({ authHeader });
  const token = authHeader ? authHeader.replace("Bearer ", "") : null;
  const user = req.user;

  await AuthService.resetPassword(token, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
    data: null,
  });
});

export const AuthController = {
  login,
  getMe,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
