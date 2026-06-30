import { Request } from "express";
import { Admin, Prisma, UserStatus } from "../../../../generated/prisma/client";
import { AdminUpdateInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../../prisma/prisma";
import AppError from "../../errors/AppError";
import { fileUploder } from "../../helper/fileUploader";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { adminSearchAbleFields } from "./admin.constant";
import httpStatus from "http-status";

const getAllFromDB = async (
  query: Record<string, unknown>,
  options: IOptions,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = query;

  const andCondions: Prisma.AdminWhereInput[] = [];

  if (query.searchTerm) {
    andCondions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andCondions.push({
    isDeleted: false,
  });

  const whereConditons: Prisma.AdminWhereInput = { AND: andCondions };

  const result = await prisma.admin.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereConditons,
  });

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

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await tx.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return result;
};

const updateIntoDB = async (id: string, req: Request) => {
  const adminData: AdminUpdateInput = req.body;

  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin isn't founded");
  }

  if (req.file) {
    const result = await fileUploder.uploadToCloudinary(req.file);

    adminData.profilePhoto = result?.secure_url;
  }

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: adminData,
  });

  if (adminData.profilePhoto && admin.profilePhoto) {
    await fileUploder.deletePhotoFromCaudinary(admin.profilePhoto as string);
  }

  return result;
};

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  softDeleteFromDB,
  updateIntoDB,
};
