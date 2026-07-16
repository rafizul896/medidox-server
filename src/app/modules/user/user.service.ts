import bcrypt from "bcryptjs";
import { prisma } from "../../../../prisma/prisma";
import { Request } from "express";
import { fileUploder } from "../../helper/fileUploader";
import { Role, UserStatus } from "../../../../generated/prisma/enums";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "../../../../generated/prisma/client";
import { userSearchableFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";

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

const changeProfileStatus = async (id: string, status: Role) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfile = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo.role === Role.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
        contactNumber: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } else if (userInfo.role === Role.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
        contactNumber: true,
        address: true,
        registrationNumber: true,
        experience: true,
        gender: true,
        appointmentFee: true,
        qualification: true,
        currentWorkingPlace: true,
        designation: true,
        averageRating: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });
  } else if (userInfo.role === Role.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
        contactNumber: true,
        address: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        patientHealthData: true,
        medicalReports: {
          select: {
            id: true,
            patientId: true,
            reportName: true,
            reportLink: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const updateMyProfile = async (user: JwtPayload, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  const oldProfilePhoto =
    userInfo.role === Role.ADMIN
      ? userInfo.admin?.profilePhoto
      : userInfo.role === Role.DOCTOR
        ? userInfo.doctor?.profilePhoto
        : userInfo.patient?.profilePhoto;

  if (req.file) {
    const result = await fileUploder.uploadToCloudinary(req.file);
    req.body.profilePhoto = result?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === Role.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === Role.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === Role.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  if (req.body.profilePhoto && oldProfilePhoto) {
    await fileUploder.deletePhotoFromCaudinary(oldProfilePhoto);
  }

  return profileInfo;
};

export const UserService = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
