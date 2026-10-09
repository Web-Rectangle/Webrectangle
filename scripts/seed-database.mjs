import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AGE_MAP = {
  '13-17': 'AGE_13_17',
  '18-24': 'AGE_18_24',
  '25-34': 'AGE_25_34',
  '35-44': 'AGE_35_44',
  '45+': 'AGE_45_PLUS',
};

async function main() {
  const seedPath = resolve(process.cwd(), 'content/seed/creators.json');
  const creators = JSON.parse(readFileSync(seedPath, 'utf-8'));

  console.log(`Seeding ${creators.length} creators into PostgreSQL database...`);

  for (const creator of creators) {
    const { audience, ...rest } = creator;
    const data = {
      ...rest,
      ...audience,
      primaryAgeBand: AGE_MAP[audience.primaryAgeBand] ?? audience.primaryAgeBand,
      origin: 'seed',
    };

    await prisma.creator.upsert({
      where: { id: creator.id },
      create: data,
      update: data,
    });
  }

  console.log(`Successfully seeded ${creators.length} creators into Supabase.`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
