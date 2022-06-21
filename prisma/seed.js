const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.create({
    data: [
      {
        name: "Super Admin",
      },
      {
        name: "Admin",
      },
      {
        name: "Manager",
      },
      {
        name: "Member",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
