import { AppointmentCreateInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../../prisma/prisma";

const createAppointment = async (
  email: string,
  payload: AppointmentCreateInput,
) => {
  const paytientData = await prisma.patient.findUnique({
    where: {
      email,
      isDeleted: false,
    },
  });

  const doctorData = await prisma.doctor.findUnique({
    where: {
      id: payload.
    },
  });
};

export const AppointmentService = {
  createAppointment,
};
