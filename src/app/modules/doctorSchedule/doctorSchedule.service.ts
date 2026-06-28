import { prisma } from "../../../../prisma/prisma";

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
    throw new Error("Doctor isn't founded");
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
