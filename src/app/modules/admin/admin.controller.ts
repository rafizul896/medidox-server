import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { adminFilterableFields } from "./admin.constant";
import { AdminService } from "./admin.service";
import httpStatus from "http-status";

const getAllFromDB = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const AdminController = {
  getAllFromDB,
};
