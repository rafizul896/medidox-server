import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { MetaService } from "./metaData.service";

const fetchDashboardMetaData = catchAsync(async (req, res, next) => {
  const user = req.user;
  const result = await MetaService.fetchDashboardMetaData(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meta data retrival successfully!",
    data: result,
  });
});

export const MetaController = {
  fetchDashboardMetaData,
};
