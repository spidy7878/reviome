import { NextRequest } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/track
 * Records a link click from the public card profile.
 * Fires via navigator.sendBeacon() — must accept plain text body.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, linkType } = body;

    if (!cardId || !linkType) {
      return Response.json({ error: "Missing cardId or linkType" }, { status: 400 });
    }

    // Look up the card by its public slug
    const card = await db.card.findUnique({
      where: { cardId },
      select: { id: true },
    });

    if (!card) {
      return Response.json({ error: "Card not found" }, { status: 404 });
    }

    // Validate linkType against known values
    const validTypes = [
      "REVIEW",
      "CONTACT",
      "SOCIAL",
      "DIRECTIONS",
      "WEBSITE",
      "MENU",
      "WIFI",
      "CUSTOM",
    ];
    if (!validTypes.includes(linkType)) {
      return Response.json({ error: "Invalid linkType" }, { status: 400 });
    }

    // Record the click
    await db.linkClick.create({
      data: {
        cardId: card.id,
        linkType,
        timestamp: new Date(),
      },
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
