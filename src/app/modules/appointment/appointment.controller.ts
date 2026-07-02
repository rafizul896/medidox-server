import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import httpStatus from "http-status";

const createAppointment = catchAsync(async (req, res, next) => {
  const email = req?.user?.email;
  const result = await AppointmentService.createAppointment(email, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Appointment is Created",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
};
