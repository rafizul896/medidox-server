import bcrypt from "bcryptjs";
import { prisma } from "../../../../prisma/prisma";
import { Request } from "express";
import { fileUploder } from "../../helper/fileUploader";
import { Role } from "../../../../generated/prisma/enums";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "../../../../generated/prisma/client";
import { userSearchableFields } from "./user.constant";

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

const getAllFromDB = async (
  params: Record<string, unknown>,
  options: IOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};



export const UserService = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllFromDB,
};
