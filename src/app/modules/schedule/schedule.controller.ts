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

export const ScheduleController = {
  createSchedule,
};
