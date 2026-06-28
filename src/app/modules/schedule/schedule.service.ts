import { format, addHours, addMinutes } from "date-fns";
import { prisma } from "../../../../prisma/prisma";

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

export const ScheduleService = {
  createSchedule,
};
