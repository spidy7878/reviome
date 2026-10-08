import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, businessName } = body;

    if (!email || !password || !businessName) {
      return NextResponse.json(
        { error: "Email, password, and business name are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Generate unique slug for business
    const baseSlug = slugify(businessName) || "business";
    let slug = baseSlug;
    let counter = 1;
    while (await db.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Ensure default card slug is also unique
    let defaultCardId = `${slug}-main`;
    let cardCounter = 1;
    while (await db.card.findUnique({ where: { cardId: defaultCardId } })) {
      defaultCardId = `${slug}-main-${cardCounter}`;
      cardCounter++;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create Business, User, and a default NFC Card in a transaction
    const result = await db.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: businessName.trim(),
          slug,
          description: `Welcome to ${businessName.trim()}`,
        },
      });

      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: name ? name.trim() : null,
          passwordHash,
          role: "OWNER",
          businessId: business.id,
        },
      });

      const defaultCard = await tx.card.create({
        data: {
          cardId: defaultCardId,
          label: "Primary Counter Card",
          businessId: business.id,
          isActive: true,
        },
      });

      return { user, business, defaultCard };
    });

    return NextResponse.json({
      success: true,
      businessId: result.business.id,
      cardId: result.defaultCard.cardId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
