import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentFilterableFields } from "./appointment.constrant";
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

const getAllFromDB = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AppointmentService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyAppointment = catchAsync(async (req, res, next) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const fillters = pick(req.query, ["status", "paymentStatus"]);
  const user = req.user;

  const result = await AppointmentService.getMyAppointment(
    user,
    fillters,
    options,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment fetched successfully!",
    data: result,
  });
});

const updateAppointmentStatus = catchAsync(
  async (req, res,next) => {
    const id = req.params.id;
    const { status } = req.body;
    const user = req.user;

    const result = await AppointmentService.updateAppointmentStatus(
      id,
      status,
      user,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment updated successfully!",
      data: result,
    });
  },
);

export const AppointmentController = {
  createAppointment,
  getAllFromDB,
  getMyAppointment,
  updateAppointmentStatus,
};
