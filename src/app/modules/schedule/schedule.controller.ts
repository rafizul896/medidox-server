import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import httpStatus from "http-status";

const createSchedule = catchAsync(async (req, res, next) => {
  const result = await ScheduleService.createSchedule(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

const schedulesForDoctor = catchAsync(async (req, res, next) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["startDate", "endDate"]);
  const {email} = req.user

  const result = await ScheduleService.schedulesForDoctor(email,filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule fatched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteScheduleFromDB = catchAsync(async (req, res, next) => {
  const result = await ScheduleService.deleteScheduleFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule deleted successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  schedulesForDoctor,
  deleteScheduleFromDB
};
