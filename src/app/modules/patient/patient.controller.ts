import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { patientFilterableFields } from "./patient.constant";
import { PatientService } from "./patient.service";

const getAllFromDB = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PatientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient is retrieved successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await PatientService.softDelete(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient soft deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const result = await PatientService.updateIntoDB(id, req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient is updated successfully!",
    data: result,
  });
});

export const PatientController = {
  getAllFromDB,
  getByIdFromDB,
  softDelete,
  updateIntoDB,
};
