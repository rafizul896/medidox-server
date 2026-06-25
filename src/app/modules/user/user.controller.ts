import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const createPatient = catchAsync(async (req, res, next) => {
  const result = await UserService.createPatient(req);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Patient is created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res, next) => {
  const result = await UserService.createDoctor(req);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Doctor is created successfully",
    data: result,
  });
});

export const UserController = {
  createPatient,
  createDoctor
};
