import { Appointment, Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../prisma/prisma";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../../helper/stripe";
import config from "../../../config";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";

const createAppointment = async (
  email: string,
  payload: {
    doctorId: string;
    scheduleId: string;
  },
) => {
  const paytientData = await prisma.patient.findUnique({
    where: {
      email,
      isDeleted: false,
    },
  });

  const doctorData = await prisma.doctor.findUnique({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const appointmentData = {
    patientId: paytientData?.id as string,
    doctorId: doctorData?.id as string,
    scheduleId: payload.scheduleId,
    videoCallingId,
  };

  return await prisma.$transaction(async (tx) => {
    const appointmentResult = await tx.appointment.create({
      data: appointmentData,
    });

    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidv4();

    const paymentData = await tx.payment.create({
      data: {
        appointmentId: appointmentResult.id,
        amount: doctorData?.appointmentFee as number,
        transactionId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Appointment with ${doctorData?.name}`,
              description: "Doctor Consultation Appointment",
            },
            unit_amount: Number(doctorData?.appointmentFee) * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          appointmentId: appointmentResult?.id,
          paymentId: paymentData.id,
        },
      },
      success_url: `${config.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.FRONTEND_URL}/payment/cancel`,
    });

    return { paymentUrl: session?.url };
  });
};

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { patientEmail, doctorEmail, ...filterData } = filters;
  const andConditions = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  } else if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
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

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      doctor: true,
      patient: true,
    },
  });
  const total = await prisma.appointment.count({
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



export const AppointmentService = {
  createAppointment,
  getAllFromDB,
};
