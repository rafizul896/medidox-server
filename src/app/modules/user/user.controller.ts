import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
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

const createAdmin = catchAsync(async (req, res, next) => {
  const result = await UserService.createAdmin(req);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Admin is created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await UserService.getAllFromDB(filters, options);

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Users retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllFromDB,
};
