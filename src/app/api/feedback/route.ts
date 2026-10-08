import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardId, rating, comment, contact } = body;

    if (!cardId || typeof rating !== "number") {
      return NextResponse.json(
        { error: "cardId and rating are required." },
        { status: 400 }
      );
    }

    const card = await db.card.findUnique({
      where: { cardId },
      include: { business: true },
    });

    if (!card || !card.business) {
      return NextResponse.json(
        { error: "Card or business not found." },
        { status: 404 }
      );
    }

    const currentTheme =
      typeof card.business.theme === "object" && card.business.theme !== null
        ? (card.business.theme as Record<string, unknown>)
        : {};

    const existingFeedback = Array.isArray(currentTheme.privateFeedback)
      ? currentTheme.privateFeedback
      : [];

    const newFeedbackEntry = {
      id: crypto.randomUUID(),
      rating,
      comment: typeof comment === "string" ? comment.trim() : "",
      contact: typeof contact === "string" ? contact.trim() : "",
      cardId,
      cardLabel: card.label || card.cardId,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    const updatedFeedback = [newFeedbackEntry, ...existingFeedback].slice(0, 100);

    await db.business.update({
      where: { id: card.business.id },
      data: {
        theme: {
          ...currentTheme,
          privateFeedback: updatedFeedback,
        } as any,
      },
    });

    // Also log a link click for analytics
    await db.linkClick.create({
      data: {
        cardId: card.id,
        linkType: "CONTACT",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Feedback error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
