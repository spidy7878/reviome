import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CardProfile } from "./card-profile";

export default async function CardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  const card = await db.card.findUnique({
    where: { cardId, isActive: true },
    include: {
      business: true,
    },
  });

  if (!card) {
    notFound();
  }

  // Record the scan server-side (fire-and-forget)
  db.scan
    .create({
      data: {
        cardId: card.id,
        timestamp: new Date(),
      },
    })
    .catch(() => {
      // Silently fail — scan tracking should never block the page
    });

  const business = card.business;
  const socialLinks = (business.socialLinks as Record<string, string>) ?? {};

  return (
    <CardProfile
      business={{
        name: business.name,
        description: business.description,
        logo: business.logo,
        phone: business.phone,
        email: business.email,
        website: business.website,
        address: business.address,
        googleMapsUrl: business.googleMapsUrl,
        googleReviewUrl: business.googleReviewUrl,
        socialLinks,
      }}
      cardId={card.cardId}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  const card = await db.card.findUnique({
    where: { cardId, isActive: true },
    include: { business: true },
  });

  if (!card) {
    return { title: "Card Not Found — Reviome" };
  }

  return {
    title: `${card.business.name} — Reviome`,
    description:
      card.business.description ??
      `Connect with ${card.business.name} via Reviome`,
  };
}
