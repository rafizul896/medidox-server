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

export const DoctorController = {
  getAllFromDB,
  updateIntoDB,
  doctorSpecialties,
};
