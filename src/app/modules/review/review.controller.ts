import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "http-status";
import { reviewFilterableFields } from "./review.constant";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";

const insertIntoDB = catchAsync(async (req, res, next) => {
  const user = req.user;
  const result = await ReviewService.insertIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ReviewService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllFromDB,
};
