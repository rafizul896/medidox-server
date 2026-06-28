import { format, addHours, addMinutes } from "date-fns";
import { prisma } from "../../../../prisma/prisma";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";

const createSchedule = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;
  const intervalTime = 30;
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    let startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0]),
        ),
        Number(startTime.split(":")[1]),
      ),
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0]),
        ),
        Number(endTime.split(":")[1]),
      ),
    );

    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime); // + 30

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };

      const isExistingSchedule = await prisma.schedule.findFirst({
        where: scheduleData,
      });

      if (isExistingSchedule) {
        throw new Error(
          "A schedule with the same time already exists in the database. Please choose a different time slot.",
        );
      }

      if (!isExistingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedules.push(result);
      }

      startDateTime = addMinutes(startDateTime, intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const schedulesForDoctor = async (
  email: string,
  query: { startDate?: string; endDate?: string },
  options: IOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email,
      },
    },
    select: {
      scheduleId: true,
    },
  });

  const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

  const result = await prisma.schedule.findMany({
    where: {
      startDateTime: {
        gte: new Date(query.startDate as string),
      },
      endDateTime: {
        lte: new Date(query.endDate as string),
      },
      id: {
        notIn: doctorScheduleIds,
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.schedule.count({
    where: {
      startDateTime: {
        gte: new Date(query.startDate as string),
      },
      endDateTime: {
        lte: new Date(query.endDate as string),
      },
       id: {
        notIn: doctorScheduleIds,
      }
    },
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

const deleteScheduleFromDB = async (id: string) => {
  return await prisma.schedule.delete({
    where: {
      id,
    },
  });
};

export const ScheduleService = {
  createSchedule,
  schedulesForDoctor,
  deleteScheduleFromDB,
};
