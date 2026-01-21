import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { platform } = await request.json();

  const response = NextResponse.json({ success: true });

  if (platform === "twitter") {
    // Clear all Twitter-related cookies
    response.cookies.delete("twitter_access_token");
    response.cookies.delete("twitter_refresh_token");
    response.cookies.delete("twitter_is_connected");
    response.cookies.delete("twitter_username");
    // Also clear the OAuth state cookies if they exist
    response.cookies.delete("twitter_oauth_state");
    response.cookies.delete("twitter_code_verifier");
  }

  return response;
}
