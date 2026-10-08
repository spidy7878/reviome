import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { GrowthClient } from "./growth-client";

export default async function GoogleGrowthPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      business: {
        include: {
          cards: {
            include: {
              _count: {
                select: { scans: true, linkClicks: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user?.business) {
    redirect("/login");
  }

  const business = user.business;
  const cardIds = business.cards.map((c: { id: string }) => c.id);

  const activeCardsCount = business.cards.filter((c: { isActive: boolean }) => c.isActive).length;

  const totalScansCount = await db.scan.count({
    where: { cardId: { in: cardIds } },
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentScansCount = await db.scan.count({
    where: {
      cardId: { in: cardIds },
      timestamp: { gte: sevenDaysAgo },
    },
  });

  const totalReviewClicks = await db.linkClick.count({
    where: {
      cardId: { in: cardIds },
      linkType: "REVIEW",
    },
  });

  const businessTheme =
    typeof business.theme === "object" && business.theme !== null
      ? (business.theme as Record<string, unknown>)
      : {};

  const initialChecklist =
    (businessTheme.checklist as Record<string, boolean>) || {};

  return (
    <GrowthClient
      business={{
        id: business.id,
        name: business.name,
        description: business.description,
        phone: business.phone,
        email: business.email,
        website: business.website,
        address: business.address,
        googleReviewUrl: business.googleReviewUrl,
        googleMapsUrl: business.googleMapsUrl,
      }}
      activeCardsCount={activeCardsCount}
      recentScansCount={recentScansCount}
      totalScansCount={totalScansCount}
      totalReviewClicks={totalReviewClicks}
      initialChecklist={initialChecklist}
    />
  );
}
