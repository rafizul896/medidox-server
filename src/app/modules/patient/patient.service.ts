import { Request } from "express";
import {
  Patient,
  Prisma,
  UserStatus,
} from "../../../../generated/prisma/client";
import { PatientUpdateInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../../prisma/prisma";
import AppError from "../../errors/AppError";
import { fileUploder } from "../../helper/fileUploader";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { patientSearchableFields } from "./patient.constant";
import httpStatus from "http-status";

const getAllFromDB = async (
  filters: Record<string, unknown>,
  options: IOptions,
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.patient.count({
    where: whereConditions,
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

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  return await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
};

const softDelete = async (id: string): Promise<Patient | null> => {
  return await prisma.$transaction(async (tx) => {
    const deletedPatient = await tx.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await tx.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedPatient;
  });
};

const updateIntoDB = async (id: string, req: Request) => {
  const patientData: PatientUpdateInput = req.body;

  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient isn't founded");
  }

  if (req.file) {
    const result = await fileUploder.uploadToCloudinary(req.file);

    patientData.profilePhoto = result?.secure_url;
  }

  const result = await prisma.patient.update({
    where: {
      id,
    },
    data: patientData,
  });

  if (patientData.profilePhoto && patient.profilePhoto) {
    await fileUploder.deletePhotoFromCaudinary(patient.profilePhoto as string);
  }

  return result;
};

export const PatientService = {
  getAllFromDB,
  getByIdFromDB,
  softDelete,
  updateIntoDB,
};
