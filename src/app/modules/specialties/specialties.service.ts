import { Request } from "express";
import { fileUploder } from "../../helper/fileUploader";
import { prisma } from "../../../../prisma/prisma";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";

const inserIntoDB = async (req: Request) => {
  const file = req.file;

  if (file) {
    const result = await fileUploder.uploadToCloudinary(file);

    req.body.icon = result?.secure_url;
  }

  return await prisma.specialties.create({
    data: req.body,
  });
};

const getAllFromDB = async (options: IOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.specialties.findMany({
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.specialties.count({});

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

const deleteFromDB = async (id: string) => {
  return prisma.specialties.delete({
    where: {
      id,
    },
  });
};

export const SpecialtiesService = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
