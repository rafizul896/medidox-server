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

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const uploadResult = await cloudinary.uploader.upload(file.path, {
    public_id: file.filename,
  });

  return uploadResult;
};

const deleteProfilePhoto = async (prevProfilePhoto: string) => {
  try {
    let publicId: string | undefined;

    if (!prevProfilePhoto.startsWith("http")) {
      publicId = prevProfilePhoto;
    } else {
      const parts = prevProfilePhoto.split("/");
      const lastPart = parts[parts.length - 1];
      publicId = lastPart.split(".")[0];
    }

    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);

      return result;
    }

    return { result: "not_found" };
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    throw error;
  }
};

export const fileUploder = {
  upload,
  uploadToCloudinary,
  deleteProfilePhoto,
};
