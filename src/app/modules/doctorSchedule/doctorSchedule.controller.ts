import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import httpStatus from "http-status";

const createDoctorSchedule = catchAsync(async (req, res, next) => {
    const {email} = req.user;
  const result = await DoctorScheduleService.createDoctorSchedule(email,req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor Schedule created successfully",
    data: result,
  });
});

export const DoctorScheduleController = {
  createDoctorSchedule,
};
