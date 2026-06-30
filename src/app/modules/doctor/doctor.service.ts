import { Request } from "express";
import {
  Doctor,
  Prisma,
  UserStatus,
} from "../../../../generated/prisma/client";
import { DoctorUpdateInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../../prisma/prisma";
import AppError from "../../errors/AppError";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchAbleFields } from "./doctor.constant";
import httpStatus from "http-status";
import { fileUploder } from "../../helper/fileUploader";

const getAllFromDB = async (
  query: Record<string, unknown>,
  options: IOptions,
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = query;

  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: doctorSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties as string,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  return await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
    },
  });
};

const updateIntoDB = async (id: string, req: Request) => {
  const doctorData: DoctorUpdateInput = req.body;

  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor isn't founded");
  }

  if (req.file) {
    const result = await fileUploder.uploadToCloudinary(req.file);

    doctorData.profilePhoto = result?.secure_url;
  }

  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: doctorData,
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  if (doctorData.profilePhoto && doctor.profilePhoto) {
    await fileUploder.deletePhotoFromCaudinary(doctor.profilePhoto as string);
  }

  return result;
};

const doctorSpecialties = async (
  id: string,
  payload: {
    specialties: string[];
    removeSpecialties: string[];
  },
) => {
  const { specialties, removeSpecialties } = payload;

  await prisma.$transaction(async (tx) => {
    if (removeSpecialties?.length) {
      await tx.doctorSpecialties.deleteMany({
        where: {
          doctorId: id,
          specialtiesId: {
            in: removeSpecialties,
          },
        },
      });
    }

    if (specialties?.length) {
      console.log("hey");
      await tx.doctorSpecialties.createMany({
        data: specialties?.map((specialtiesId) => ({
          doctorId: id,
          specialtiesId: specialtiesId,
        })),
        skipDuplicates: true,
      });
    }
  });

  return await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  doctorSpecialties,
  softDelete,
};
