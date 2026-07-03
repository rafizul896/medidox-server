import Stripe from "stripe";
import { prisma } from "../../../../prisma/prisma";
import { PaymentStatus } from "../../../../generated/prisma/enums";

const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;

      const appointmentId = paymentIntent.metadata?.appointmentId;
      const paymentId = paymentIntent.metadata?.paymentId;

      if (!appointmentId || !paymentId) {
        throw new Error("Missing metadata");
      }

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: PaymentStatus.PAID,
            paymentGatewayData: {
              paymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: paymentIntent.status,
              created: paymentIntent.created,
            },
          },
        });

        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus: PaymentStatus.PAID,
          },
        });
      });

      break;
    }
  }
};

export const PaymentService = {
  handleStripeWebhook,
};
