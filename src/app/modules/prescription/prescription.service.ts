import httpStatus from "http-status";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../../../prisma/prisma";
import {
  AppointmentStatus,
  PaymentStatus,
  Role,
} from "../../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { Prescription } from "../../../../generated/prisma/client";

const createPrescription = async (
  user: JwtPayload,
  payload: Partial<Prescription>,
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === Role.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email))
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This is not your appointment",
      );
  }

  return await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate
        ? new Date(payload.followUpDate)
        : null,
    },
    include: {
      patient: true,
    },
  });
};

const patientPrescription = async (user: JwtPayload, options: IOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};

export const PrescriptionService = {
  createPrescription,
  patientPrescription,
};
