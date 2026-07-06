import path from "path";
import config from "../../config";
import AppError from "../errors/AppError";
import nodemailer from "nodemailer"
import ejs from 'ejs';

const transporter = nodemailer.createTransport({
  host: config.SMTP.SMTP_HOST,
  port: Number(config.SMTP.SMTP_PORT),
  secure: false,
  auth: {
    user: config.SMTP.SMTP_USER,
    pass: config.SMTP.SMTP_PASS,
  },
});

interface ISendEmail {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmail) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: config.SMTP.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Email seanding error", err);
      throw new AppError(401, `Email Error || ${err.message}`);
    }
  }
};
