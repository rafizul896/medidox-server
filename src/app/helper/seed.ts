import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../../prisma/prisma";
import config from "../../config";
import bcrypt from "bcryptjs";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
        email: config.SUPER_ADMIN_EMAIL
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.SUPER_ADMIN_PASSWORD as string,
      Number(config.BCRYPT_SALT_ROUND),
    );

    const superAdminData = await prisma.user.create({
      data: {
        email: config.SUPER_ADMIN_EMAIL as string,
        password: hashedPassword,
        role: Role.ADMIN,
        admin: {
          create: {
            name: "Admin",
            contactNumber: "01XXXXXXXXX",
          },
        },
      },
    });

    console.log("Super Admin Created Successfully!", superAdminData);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedSuperAdmin;
