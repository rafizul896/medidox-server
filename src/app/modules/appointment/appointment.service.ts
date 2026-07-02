import { Appointment } from "../../../../generated/prisma/client";
import { prisma } from "../../../../prisma/prisma";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (
  email: string,
  payload: {
    doctorId: string;
    scheduleId: string;
  },
) => {
  const paytientData = await prisma.patient.findUnique({
    where: {
      email,
      isDeleted: false,
    },
  });

  const doctorData = await prisma.doctor.findUnique({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const appointmentData = {
    patientId: paytientData?.id as string,
    doctorId: doctorData?.id as string,
    scheduleId: payload.scheduleId,
    videoCallingId,
  };

  return await prisma.$transaction(async (tx) => {
    const result = await tx.appointment.create({
      data: appointmentData,
    });

    await prisma.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    return result;
  });
};

export const AppointmentService = {
  createAppointment,
};
