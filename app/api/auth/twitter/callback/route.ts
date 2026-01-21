import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  const storedState = request.cookies.get("twitter_oauth_state")?.value;
  const codeVerifier = request.cookies.get("twitter_code_verifier")?.value;

  if (
    !state ||
    !code ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return NextResponse.json(
      { error: "Invalid state or code missing" },
      { status: 400 },
    );
  }

  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });

  try {
    const { accessToken, refreshToken, expiresIn } =
      await client.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: process.env.TWITTER_REDIRECT_URI!,
      });

    const response = NextResponse.redirect(
      new URL("/generator?connected=true&platform=twitter", request.url),
    );

    // Set secure Access Token Cookie
    response.cookies.set("twitter_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expiresIn, // Use actual expiration
    });

    // Set secure Refresh Token Cookie
    if (refreshToken) {
      response.cookies.set("twitter_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Fetch authenticated user details to get username
    const userClient = new TwitterApi(accessToken);
    const { data: user } = await userClient.v2.me();

    // Set a client-readable cookie so UI knows we are connected
    response.cookies.set("twitter_is_connected", "true", {
      httpOnly: false, // Client can read
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expiresIn,
    });

    // Store username in cookie for UI display
    if (user?.username) {
      response.cookies.set("twitter_username", user.username, {
        httpOnly: false, // Client can read
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: expiresIn,
      });
    }

    return response;
  } catch (error) {
    console.error("Twitter Login Error:", error);
    return NextResponse.json(
      { error: "Failed to login with Twitter" },
      { status: 403 },
    );
  }
}
