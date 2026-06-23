import bcrypt from "bcryptjs";
import { prisma } from "../../../../prisma/prisma";
import { Patient } from "../../../../generated/prisma/client";

const createPatient = async (payload: Patient & { password: string }) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
      },
    });

    return await tx.patient.create({
      data: {
        name: payload.name,
        email: payload.email,
      },
    });
  });

  return result;
};

export const UserService = {
  createPatient,
};
