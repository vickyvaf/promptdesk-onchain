import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    let accessToken = request.cookies.get("twitter_access_token")?.value;
    const refreshToken = request.cookies.get("twitter_refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { error: "Not authenticated with Twitter" },
        { status: 401 },
      );
    }

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    // Try to refresh if no access token but have refresh token
    let newAccessToken = null;
    let newRefreshToken = null;
    let newExpiresIn = null;

    if (!accessToken && refreshToken) {
      try {
        const {
          accessToken: newAccess,
          refreshToken: newRefresh,
          expiresIn,
        } = await client.refreshOAuth2Token(refreshToken);
        accessToken = newAccess;
        newAccessToken = newAccess;
        newRefreshToken = newRefresh;
        newExpiresIn = expiresIn;
      } catch (e) {
        console.error("Failed to refresh token", e);
        return NextResponse.json(
          { error: "Session expired. Please reconnect." },
          { status: 401 },
        );
      }
    }

    // Now post the tweet
    const userClient = new TwitterApi(accessToken!);

    try {
      const tweet = await userClient.v2.tweet(content);

      const response = NextResponse.json({ success: true, result: tweet });

      // Update cookies if we refreshed
      if (newAccessToken) {
        response.cookies.set("twitter_access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: newExpiresIn!,
        });
      }

      if (newRefreshToken) {
        response.cookies.set("twitter_refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      return response;
    } catch (twitterError: any) {
      console.error(
        "Twitter API Error Full:",
        JSON.stringify(twitterError, null, 2),
      );

      return NextResponse.json(
        {
          error: twitterError.message || "Failed to post to Twitter",
          details:
            twitterError.data || twitterError.error || "No additional details",
          code: twitterError.code,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error posting content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
