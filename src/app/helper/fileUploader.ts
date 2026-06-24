import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
  cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY.CLOUDINARY_API_SECRET,
  });

  const uploadResult = await cloudinary.uploader.upload(file.path, {
    public_id: file.filename,
  });

  return uploadResult;
};

export const fileUploder = {
  upload,
  uploadToCloudinary,
};
