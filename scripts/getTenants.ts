import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany();
  console.log(tenants);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());