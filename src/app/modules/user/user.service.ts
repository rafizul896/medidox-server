import bcrypt from "bcryptjs";
import { prisma } from "../../../../prisma/prisma";
import { Request } from "express";
import { fileUploder } from "../../helper/fileUploader";

const createPatient = async (req: Request) => {
  const pyload = req.body.patient;
  const hashPassword = await bcrypt.hash(req.body.password, 10);

  if (req.file) {
    const result = await fileUploder.uploadToCloudinary(req.file);

    pyload.profilePhoto = result?.secure_url;
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: pyload?.email,
        password: hashPassword,
      },
    });

    return await tx.patient.create({
      data: {
        ...pyload,
      },
    });
  });

  return result;
};

export const UserService = {
  createPatient,
};
