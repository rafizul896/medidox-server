import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../helper/stripe";
import Stripe from "stripe";
import config from "../../../config";

const handleStripeWebhookEvent = catchAsync(async (req, res, next) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = config.STRIPE_WEBHOOK_SECRET as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return next(err);
  }

  const result = await PaymentService.handleStripeWebhook(event);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Webhook req send successfully",
    data: result,
  });
});

export const PaymentController = {
  handleStripeWebhookEvent,
};
