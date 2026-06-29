import { Prisma } from "../../../../generated/prisma/client";
import { DoctorUpdateInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../../prisma/prisma";
import AppError from "../../errors/AppError";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchAbleFields } from "./doctor.constant";
import httpStatus from "http-status";

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

const updateIntoDB = async (
  id: string,
  payload: DoctorUpdateInput & { specialties: string },
) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor isn't founded");
  }

  const { specialties, ...doctorData } = payload;

  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: doctorData,
  });

  return result;
};

export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
};
