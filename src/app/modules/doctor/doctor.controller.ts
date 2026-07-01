import catchAsync from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { doctorFilterableFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async (req, res, next) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const fillters = pick(req.query, doctorFilterableFields);

  const result = await DoctorService.getAllFromDB(fillters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await DoctorService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const result = await DoctorService.updateIntoDB(id, req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

const doctorSpecialties = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const result = await DoctorService.doctorSpecialties(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor specialties updated successfully!",
    data: result,
  });
});

const softDelete = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await DoctorService.softDelete(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

const getAISuggestions = catchAsync(async (req, res, next) => {
  const symptoms = req.query.symptoms as string;
  const result = await DoctorService.getAISuggestions(symptoms);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "AI suggestions fetched successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  doctorSpecialties,
  softDelete,
  getAISuggestions,
};
