import bcrypt from "bcryptjs";
import { prisma } from "../../../../prisma/prisma";
import { Request } from "express";
import { fileUploder } from "../../helper/fileUploader";
import { Role } from "../../../../generated/prisma/enums";

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

const createDoctor = async (req: Request) => {
  const payload = req.body.doctor;
  const hashPassword = await bcrypt.hash(req.body.password, 10);

  if (req.file) {
    const result = await fileUploder.uploadToCloudinary(req.file);

    payload.profilePhoto = result?.secure_url;
  }

  return await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: payload?.email,
        password: hashPassword,
        role: Role.DOCTOR,
      },
    });

    return tx.doctor.create({
      data: {
        ...payload,
      },
    });
  });
};

const createAdmin = async (req: Request) => {
  const payload = req.body.admin;
  const hashPassword = await bcrypt.hash(req.body.password, 10);


  if (req.file) {
    const result = await fileUploder.uploadToCloudinary(req.file);

    payload.profilePhoto = result?.secure_url;
  }

  return await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: payload?.email,
        password: hashPassword,
        role: Role.ADMIN,
      },
    });

    return tx.admin.create({
      data: {
        ...payload,
      },
    });
  });
};

export const UserService = {
  createPatient,
  createDoctor,
  createAdmin,
};
