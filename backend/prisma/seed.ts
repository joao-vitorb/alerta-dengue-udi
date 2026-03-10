import { prisma } from "../src/lib/prisma";
import { healthUnitsSeedData } from "./data/healthUnitsSeedData";

async function main() {
  await prisma.healthUnit.deleteMany();

  await prisma.healthUnit.createMany({
    data: healthUnitsSeedData,
  });

  console.log(`Seed completed with ${healthUnitsSeedData.length} health units`);
}

main()
  .catch((error) => {
    console.error("Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
