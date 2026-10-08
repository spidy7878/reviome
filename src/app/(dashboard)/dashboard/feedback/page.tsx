import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { FeedbackClient } from "./feedback-client";

export default async function FeedbackPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { business: true },
  });

  if (!user?.business) {
    redirect("/login");
  }

  const business = user.business;
  const businessTheme =
    typeof business.theme === "object" && business.theme !== null
      ? (business.theme as Record<string, unknown>)
      : {};

  const privateFeedbacks =
    (businessTheme.privateFeedback as Array<any>) || [];

  return <FeedbackClient initialFeedbacks={privateFeedbacks} />;
}
