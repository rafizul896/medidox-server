import { JwtPayload } from "jsonwebtoken";
import { PaymentStatus, Role } from "../../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { prisma } from "../../../../prisma/prisma";

const fetchDashboardMetaData = (user: JwtPayload) => {
  let metaData;

  switch (user.role) {
    case Role.ADMIN:
      metaData = getAdminMetaData();
      break;
    case Role.DOCTOR:
      metaData = "Doctor";
      break;
    case Role.PATIENT:
      metaData = "Patient";
      break;
    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid user role");
  }

  return metaData;
};

const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    where: {
      status: PaymentStatus.PAID,
    },
    _sum: { amount: true },
  });

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
  };
};

export const MetaService = {
  fetchDashboardMetaData,
};
