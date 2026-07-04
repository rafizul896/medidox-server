import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import httpStatus from "http-status";
import { PrescriptionService } from "./prescription.service";

const createPrescription = catchAsync(async (req, res, next) => {
  const user = req.user;
  const result = await PrescriptionService.createPrescription(user, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Prescription created successfully!",
    data: result,
  });
});

const patientPrescription = catchAsync(async (req, res, next) => {
  const user = req.user;
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PrescriptionService.patientPrescription(user, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PrescriptionController = {
  createPrescription,
  patientPrescription,
};
