import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../prisma/prisma";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { adminSearchAbleFields } from "./admin.constant";

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

export const AdminService = {
  getAllFromDB,
};
