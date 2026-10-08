"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { business: true },
  });

  if (!user || !user.business) {
    throw new Error("User or business not found");
  }

  return user;
}

export async function updateBusinessProfile(formData: {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  googleMapsUrl?: string;
  googleReviewUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    wifi?: string;
  };
}) {
  const user = await getAuthenticatedUser();

  await db.business.update({
    where: { id: user.business.id },
    data: {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      phone: formData.phone?.trim() || null,
      email: formData.email?.trim() || null,
      website: formData.website?.trim() || null,
      address: formData.address?.trim() || null,
      googleMapsUrl: formData.googleMapsUrl?.trim() || null,
      googleReviewUrl: formData.googleReviewUrl?.trim() || null,
      socialLinks: formData.socialLinks || {},
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/growth");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/feedback");
  // Also revalidate public card pages for this business
  const cards = await db.card.findMany({
    where: { businessId: user.business.id },
    select: { cardId: true },
  });
  for (const c of cards) {
    revalidatePath(`/c/${c.cardId}`);
  }

  return { success: true };
}

export async function saveGoogleLocation(params: {
  accountId: string;
  locationId: string;
  locationName: string;
}) {
  const user = await getAuthenticatedUser();

  if (!user.business.googleAccessToken && !user.business.googleRefreshToken) {
    throw new Error("Google Business Profile is not connected");
  }

  if (!params.accountId || !params.locationId || !params.locationName) {
    throw new Error("accountId, locationId, and locationName are required");
  }

  await db.business.update({
    where: { id: user.business.id },
    data: {
      googleAccountId: params.accountId,
      googleLocationId: params.locationId,
      googleLocationName: params.locationName,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/growth");
  revalidatePath("/dashboard/reviews");

  return { success: true };
}

export async function toggleCardStatus(cardDbId: string, isActive: boolean) {
  const user = await getAuthenticatedUser();

  const card = await db.card.findFirst({
    where: { id: cardDbId, businessId: user.business.id },
  });

  if (!card) {
    throw new Error("Card not found or unauthorized");
  }

  await db.card.update({
    where: { id: cardDbId },
    data: { isActive },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cards");
  revalidatePath(`/c/${card.cardId}`);

  return { success: true };
}

export async function createNewCard(data: { cardId: string; label?: string }) {
  const user = await getAuthenticatedUser();

  const slugifiedCardId = data.cardId
    .toLowerCase()
    .trim()
    .replace(/[^\w-]/g, "-")
    .replace(/-+/g, "-");

  if (!slugifiedCardId) {
    throw new Error("Card identifier is required");
  }

  // Check if cardId is already taken globally
  const existing = await db.card.findUnique({
    where: { cardId: slugifiedCardId },
  });

  if (existing) {
    throw new Error("This Card ID is already in use. Please pick a unique slug.");
  }

  const newCard = await db.card.create({
    data: {
      cardId: slugifiedCardId,
      label: data.label?.trim() || "NFC Card",
      businessId: user.business.id,
      isActive: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cards");

  return { success: true, card: newCard };
}

export async function saveChecklistProgress(checklistState: Record<string, boolean>) {
  const user = await getAuthenticatedUser();

  const currentTheme =
    typeof user.business.theme === "object" && user.business.theme !== null
      ? (user.business.theme as Record<string, unknown>)
      : {};

  await db.business.update({
    where: { id: user.business.id },
    data: {
      theme: {
        ...currentTheme,
        checklist: checklistState,
      } as any,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/growth");
  return { success: true };
}

export async function resolveFeedbackItem(feedbackId: string) {
  const user = await getAuthenticatedUser();

  const currentTheme =
    typeof user.business.theme === "object" && user.business.theme !== null
      ? (user.business.theme as Record<string, unknown>)
      : {};

  const existingFeedback = Array.isArray(currentTheme.privateFeedback)
    ? (currentTheme.privateFeedback as Array<Record<string, unknown>>)
    : [];

  const updatedFeedback = existingFeedback.map((item) =>
    item.id === feedbackId ? { ...item, resolved: true } : item
  );

  await db.business.update({
    where: { id: user.business.id },
    data: {
      theme: {
        ...currentTheme,
        privateFeedback: updatedFeedback,
      } as any,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/feedback");
  return { success: true };
}

export async function saveReviewReply(reviewId: string, replyText: string) {
  const user = await getAuthenticatedUser();

  if ((db as any).review) {
    const review = await (db as any).review.findFirst({
      where: { id: reviewId, businessId: user.business.id },
    });

    if (!review) {
      throw new Error("Review not found or unauthorized");
    }

    await (db as any).review.update({
      where: { id: reviewId },
      data: {
        responseText: replyText.trim(),
        responseDate: new Date(),
        responseStatus: "REPLIED",
      },
    });
  } else {
    await db.$executeRawUnsafe(
      `UPDATE "Review" SET "responseText" = $1, "responseDate" = NOW(), "responseStatus" = 'REPLIED' WHERE id = $2 AND "businessId" = $3`,
      replyText.trim(),
      reviewId,
      user.business.id
    );
  }

  revalidatePath("/dashboard/reviews");
  revalidatePath("/dashboard/growth");
  return { success: true };
}

export async function addManualReview(data: {
  reviewerName: string;
  rating: number;
  reviewText: string;
}) {
  const user = await getAuthenticatedUser();

  let newReview: any;

  if ((db as any).review) {
    newReview = await (db as any).review.create({
      data: {
        businessId: user.business.id,
        reviewerName: data.reviewerName.trim() || "Google Customer",
        rating: Math.max(1, Math.min(5, data.rating)),
        reviewText: data.reviewText.trim(),
        reviewDate: new Date(),
        responseStatus: "UNANSWERED",
      },
    });
  } else {
    const id = crypto.randomUUID();
    await db.$executeRawUnsafe(
      `INSERT INTO "Review" ("id", "rating", "reviewText", "reviewerName", "reviewDate", "responseStatus", "businessId", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), 'UNANSWERED', $5, NOW())`,
      id,
      Math.max(1, Math.min(5, data.rating)),
      data.reviewText.trim(),
      data.reviewerName.trim() || "Google Customer",
      user.business.id
    );
    newReview = {
      id,
      rating: Math.max(1, Math.min(5, data.rating)),
      reviewText: data.reviewText.trim(),
      reviewerName: data.reviewerName.trim() || "Google Customer",
      reviewerPhotoUrl: null,
      reviewDate: new Date(),
      responseText: null,
      responseDate: null,
      responseStatus: "UNANSWERED",
      externalReviewId: null,
    };
  }

  revalidatePath("/dashboard/reviews");
  revalidatePath("/dashboard/growth");
  return { success: true, review: newReview };
}

export async function generateAiReviewReply(params: {
  reviewText: string;
  rating: number;
  reviewerName?: string;
  tone: "Professional" | "Friendly" | "Warm" | "Concise";
}) {
  const user = await getAuthenticatedUser();
  const businessName = user.business.name;
  const name = params.reviewerName || "valued customer";
  const rating = params.rating;
  const text = params.reviewText.trim();
  const tone = params.tone;

  const prompt = `You are the owner of "${businessName}". Write a response to this Google review.
Reviewer: ${name}
Rating: ${rating} out of 5 stars
Review: "${text}"
Requested Tone: ${tone}

Rules:
- Keep the response natural, authentic, and polite.
- Address only the specific feedback mentioned by the customer.
- Never invent dishes, staff names, or services that were not mentioned.
- If negative (1-3 stars), apologize for the specific issue and offer to make it right.
- If positive (4-5 stars), express genuine gratitude.
- Return ONLY the final response text without quotation marks or conversational commentary.`;

  // 1. Try Gemini REST API if GEMINI_API_KEY is configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generated) return { reply: generated.trim() };
      }
    } catch (e) {
      console.error("Gemini API call failed, falling back to local synthesizer", e);
    }
  }

  // 2. Try OpenAI REST API if OPENAI_API_KEY is configured
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const generated = data.choices?.[0]?.message?.content;
        if (generated) return { reply: generated.trim() };
      }
    } catch (e) {
      console.error("OpenAI API call failed, falling back to local synthesizer", e);
    }
  }

  // 3. High-Quality Deterministic Contextual Synthesizer (Zero-cost, Zero-dependency fallback)
  let generated = "";
  if (rating >= 4) {
    if (tone === "Concise") {
      generated = `Thank you so much for the ${rating}-star review, ${name}! We're thrilled you had a great experience at ${businessName}. Hope to see you again soon!`;
    } else if (tone === "Warm") {
      generated = `Dear ${name}, thank you from the bottom of our hearts for taking the time to share your feedback! Knowing that you had such a wonderful visit at ${businessName} truly makes our day. We look forward to welcoming you back anytime!`;
    } else if (tone === "Friendly") {
      generated = `Hey ${name}, thanks a ton for the amazing review! Our team at ${businessName} loved hosting you. Can't wait to see you again soon!`;
    } else {
      // Professional
      generated = `Dear ${name}, thank you for your generous review and high recommendation. The entire team at ${businessName} is dedicated to delivering excellence, and we appreciate your patronage. We look forward to your next visit.`;
    }
  } else if (rating === 3) {
    if (tone === "Concise") {
      generated = `Thank you for sharing your experience, ${name}. We appreciate your honest feedback and are already working to improve. We hope to serve you better next time.`;
    } else if (tone === "Warm") {
      generated = `Dear ${name}, thank you for taking the time to share your thoughts with us. We want every visit to ${businessName} to be exceptional, so we appreciate you pointing out where we can do better. We'd love the opportunity to welcome you back for a truly 5-star experience.`;
    } else if (tone === "Friendly") {
      generated = `Hi ${name}, thanks for letting us know about your visit. We're always looking for ways to improve, and your feedback helps us get there. We hope you'll give us another chance next time!`;
    } else {
      // Professional
      generated = `Dear ${name}, thank you for your feedback regarding your recent visit to ${businessName}. We value your perspective and are actively reviewing your comments with our management team to ensure consistent quality. We hope to have the pleasure of serving you again soon.`;
    }
  } else {
    // 1-2 stars
    if (tone === "Concise") {
      generated = `Dear ${name}, we sincerely apologize that your experience at ${businessName} fell short of expectations. We take this seriously and would appreciate the chance to make it right.`;
    } else if (tone === "Warm") {
      generated = `Dear ${name}, we are truly sorry that we didn't give you the experience you deserved at ${businessName}. Your satisfaction means everything to our team. Please reach out to us directly so we can understand what happened and make things right for you.`;
    } else if (tone === "Friendly") {
      generated = `Hi ${name}, we're really sorry your visit didn't go well. We take pride in our service at ${businessName} and clearly dropped the ball here. Please reach out to us so we can connect directly and make this right!`;
    } else {
      // Professional
      generated = `Dear ${name}, thank you for bringing your experience to our attention. At ${businessName}, we hold ourselves to high standards, and we sincerely regret that your visit did not meet them. We would welcome the opportunity to discuss your experience directly and ensure proper steps are taken.`;
    }
  }

  return { reply: generated };
}

