import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { scheduleFilterableFields } from "./doctorSchedule.constant";
import { DoctorScheduleService } from "./doctorSchedule.service";
import httpStatus from "http-status";

const createDoctorSchedule = catchAsync(async (req, res, next) => {
  const { email } = req.user;
  const result = await DoctorScheduleService.createDoctorSchedule(
    email,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor Schedule created successfully",
    data: result,
  });
});

const getMySchedule = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const user = req.user;

  const result = await DoctorScheduleService.getMySchedule(
    filters,
    options,
    user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Schedule fetched successfully!",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const result = await DoctorScheduleService.deleteFromDB(user, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Schedule deleted successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await DoctorScheduleService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Schedule retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const DoctorScheduleController = {
  createDoctorSchedule,
  getMySchedule,
  deleteFromDB,
  getAllFromDB,
};
