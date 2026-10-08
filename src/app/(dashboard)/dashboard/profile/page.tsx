import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileClient } from "./profile-client";

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProfilePage({ searchParams }: PageProps) {
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
  const socialLinks = (business.socialLinks as Record<string, string>) ?? {};

  const resolvedParams = searchParams ? await searchParams : {};
  const googleParam = typeof resolvedParams.google === "string" ? resolvedParams.google : undefined;
  const googleErrorParam =
    typeof resolvedParams.google_error === "string" ? resolvedParams.google_error : undefined;

  // Determine Google connection status and connected timestamp server-side
  // Do NOT pass access token or refresh token to the client component
  const isConnected = Boolean(business.googleRefreshToken && business.googleConnectedAt);
  const connectedAt = business.googleConnectedAt ? business.googleConnectedAt.toISOString() : null;

  return (
    <ProfileClient
      initialData={{
        name: business.name,
        description: business.description,
        phone: business.phone,
        email: business.email,
        website: business.website,
        address: business.address,
        googleMapsUrl: business.googleMapsUrl,
        googleReviewUrl: business.googleReviewUrl,
        socialLinks,
        slug: business.slug,
      }}
      googleIntegration={{
        isConnected,
        connectedAt,
        googleAccountId: business.googleAccountId,
        googleLocationId: business.googleLocationId,
        googleLocationName: business.googleLocationName,
      }}
      googleParam={googleParam}
      googleErrorParam={googleErrorParam}
    />
  );
}
