import { prisma } from "../../../../prisma/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createDoctorSchedule = async (
  email: string,
  payload: { scheduleIds: string[] },
) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      email,
    },
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND,"Doctor isn't founded");
  }

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctor.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });

  return result;
};

export const DoctorScheduleService = {
  createDoctorSchedule,
};
