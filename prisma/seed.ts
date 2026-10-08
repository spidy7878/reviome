import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Create demo business ──────────────────────────────
  const business = await prisma.business.upsert({
    where: { slug: "artisan-bakery" },
    update: {},
    create: {
      name: "Artisan Bakery & Cafe",
      slug: "artisan-bakery",
      description:
        "Handcrafted sourdough, specialty coffee, and fresh pastries in the heart of downtown. Family-owned since 2018.",
      phone: "+1 (555) 234-5678",
      email: "hello@artisanbakery.com",
      website: "https://artisanbakery.com",
      address: "142 Main Street, Portland, OR 97201",
      googleMapsUrl: "https://maps.google.com/?q=Artisan+Bakery+Portland",
      googleReviewUrl:
        "https://search.google.com/local/writereview?placeid=EXAMPLE_PLACE_ID",
      socialLinks: {
        instagram: "https://instagram.com/artisanbakery",
        facebook: "https://facebook.com/artisanbakery",
        tiktok: "https://tiktok.com/@artisanbakery",
      },
      theme: {
        primaryColor: "#0a0a0a",
        accentColor: "#f59e0b",
      },
    },
  });

  console.log(`✅ Business created: ${business.name} (${business.id})`);

  // ── Create NFC cards ──────────────────────────────────
  const card1 = await prisma.card.upsert({
    where: { cardId: "artisan-counter" },
    update: {},
    create: {
      cardId: "artisan-counter",
      label: "Front Counter Card",
      businessId: business.id,
      isActive: true,
    },
  });

  const card2 = await prisma.card.upsert({
    where: { cardId: "artisan-table" },
    update: {},
    create: {
      cardId: "artisan-table",
      label: "Table Tent Card",
      businessId: business.id,
      isActive: true,
    },
  });

  console.log(`✅ Cards created: ${card1.cardId}, ${card2.cardId}`);

  // ── Create some demo scans ────────────────────────────
  const now = new Date();
  const scans = [];
  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 14);
    scans.push({
      cardId: i % 3 === 0 ? card2.id : card1.id,
      timestamp: new Date(now.getTime() - daysAgo * 86400000),
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
      ipHash: `hash_${i}`,
      city: "Portland",
      country: "US",
    });
  }

  await prisma.scan.createMany({ data: scans });
  console.log(`✅ Created ${scans.length} demo scans`);

  // ── Create some demo link clicks ──────────────────────
  const linkTypes = [
    "REVIEW",
    "REVIEW",
    "REVIEW",
    "CONTACT",
    "SOCIAL",
    "DIRECTIONS",
    "MENU",
    "WEBSITE",
  ] as const;

  const clicks = linkTypes.map((linkType, i) => ({
    cardId: i % 2 === 0 ? card1.id : card2.id,
    linkType,
    timestamp: new Date(
      now.getTime() - Math.floor(Math.random() * 7) * 86400000
    ),
  }));

  await prisma.linkClick.createMany({ data: clicks });
  console.log(`✅ Created ${clicks.length} demo link clicks`);

  // ── Create demo user ──────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "owner@artisanbakery.com" },
    update: { passwordHash },
    create: {
      email: "owner@artisanbakery.com",
      name: "Elena Rostova",
      passwordHash,
      role: "OWNER",
      businessId: business.id,
    },
  });
  console.log(`✅ Demo user created: ${user.email} (password: password123)`);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
