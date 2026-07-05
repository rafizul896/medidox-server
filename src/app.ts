import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import config from "./config";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/modules/payment/payment.controller";
import cron from "node-cron";
import { AppointmentService } from "./app/modules/appointment/appointment.service";

const app: Application = express();

app.post(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cron.schedule("* * * * *", () => {
  try {
    AppointmentService.cancelUnpaidAppointment();
  } catch (err) {
    console.log(err);
  }
});

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    environment: config.NODE_ENV,
    message: "Server is running... 🏃‍♂️‍➡️",
    uptime: process.uptime().toFixed(2),
    timeStamp: new Date().toLocaleString(),
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
