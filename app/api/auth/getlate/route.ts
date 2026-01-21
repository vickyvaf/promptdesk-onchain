import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platform = searchParams.get("platform");
  const redirectUri = searchParams.get("redirect_uri");
  const profileId = searchParams.get("profileId");

  if (!platform || !redirectUri || !profileId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://getlate.dev/api/v1/connect/${platform}?redirect_uri=${encodeURIComponent(
        redirectUri,
      )}&profileId=${profileId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add API Key if needed by GetLate for this endpoint, though usually not for the connect flow
          Authorization: `Bearer ${process.env.GETLATE_API_KEY}`,
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error connecting to GetLate:", error);
    return NextResponse.json(
      { error: "Failed to connect to GetLate" },
      { status: 500 },
    );
  }
}
