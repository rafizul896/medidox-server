import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  },
  SMTP: {
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    SMTP_FROM: process.env.SMTP_FROM as string,
  },
};
