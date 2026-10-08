import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReviewsClient, ReviewItem } from "./reviews-client";

export default async function ReviewsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      business: true,
    },
  });

  if (!user?.business) {
    redirect("/login");
  }

  const business = user.business;

  let initialReviews: ReviewItem[] = [];

  try {
    if ((db as any).review) {
      const list = await (db as any).review.findMany({
        where: { businessId: business.id },
        orderBy: { reviewDate: "desc" },
      });
      initialReviews = list.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        reviewText: r.reviewText,
        reviewerName: r.reviewerName,
        reviewerPhotoUrl: r.reviewerPhotoUrl,
        reviewDate: new Date(r.reviewDate).toISOString(),
        responseText: r.responseText,
        responseDate: r.responseDate ? new Date(r.responseDate).toISOString() : null,
        responseStatus: r.responseStatus,
        externalReviewId: r.externalReviewId,
      }));
    } else {
      // Direct SQL fallback if active Node process hasn't reloaded PrismaClient yet
      const rows = await db.$queryRawUnsafe<any[]>(
        `SELECT * FROM "Review" WHERE "businessId" = $1 ORDER BY "reviewDate" DESC`,
        business.id
      );
      initialReviews = rows.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        reviewText: r.reviewText,
        reviewerName: r.reviewerName,
        reviewerPhotoUrl: r.reviewerPhotoUrl,
        reviewDate: new Date(r.reviewDate).toISOString(),
        responseText: r.responseText,
        responseDate: r.responseDate ? new Date(r.responseDate).toISOString() : null,
        responseStatus: r.responseStatus,
        externalReviewId: r.externalReviewId,
      }));
    }
  } catch (err) {
    console.error("Reviews query fallback:", err);
  }

  return (
    <ReviewsClient
      businessName={business.name}
      googleReviewUrl={business.googleReviewUrl}
      initialReviews={initialReviews}
    />
  );
}
