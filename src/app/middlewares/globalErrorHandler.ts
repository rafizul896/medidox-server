import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate key error";
      statusCode = httpStatus.CONFLICT;
      error = error.meta;
    } else if (err.code === "P1000") {
      message = "Authentication failed against database server";
      statusCode = httpStatus.BAD_GATEWAY;
    } else if (err.code === "P2003") {
      message = "Foreign key constraint failed";
      statusCode = httpStatus.BAD_REQUEST;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Unkown Prisma error occured!";
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = "Prisma client failed to initialize!";
    statusCode = httpStatus.BAD_REQUEST;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
