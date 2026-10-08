import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CardsClient } from "./cards-client";

export default async function CardsPage() {
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
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!user?.business) {
    redirect("/login");
  }

  const cards = user.business.cards;

  return <CardsClient initialCards={cards} />;
}
