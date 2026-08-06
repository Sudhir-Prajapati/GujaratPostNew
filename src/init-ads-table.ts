import { prisma } from './config/prisma.js';

async function main() {
  try {
    console.log('Ensuring advertisements table exists in MySQL database...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`advertisements\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`section\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(191) NULL,
        \`isActive\` TINYINT(1) NOT NULL DEFAULT 1,
        \`image1\` TEXT NULL,
        \`link1\` TEXT NULL,
        \`image2\` TEXT NULL,
        \`link2\` TEXT NULL,
        \`image3\` TEXT NULL,
        \`link3\` TEXT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`advertisements_section_key\` (\`section\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table `advertisements` verified and ready in MySQL database!');
  } catch (err) {
    console.error('Error creating advertisements table:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
