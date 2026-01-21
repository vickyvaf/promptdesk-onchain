export const connectToPlatform = async (platform: string) => {
  if (typeof window === "undefined") return;

  const profileId = process.env.NEXT_PUBLIC_GETLATE_PROFILE_ID;
  if (!profileId) {
    console.error("NEXT_PUBLIC_GETLATE_PROFILE_ID is not defined");
    return;
  }

  /*
   * The GetLate API returns a JSON object with the authUrl.
   * We need to fetch it first, then redirect the user.
   */
  try {
    // Store platform in localStorage to retrieve it after callback
    localStorage.setItem("connecting_platform", platform);

    const callbackUrl = new URL(
      `${window.location.origin}/oauth/getlate/callback`,
    );
    // callbackUrl.searchParams.set("platform", platform); // Removed to simplify redirect_uri

    const apiUrl = new URL("/api/auth/getlate", window.location.origin);
    apiUrl.searchParams.set("platform", platform);
    apiUrl.searchParams.set("redirect_uri", callbackUrl.toString());
    apiUrl.searchParams.set("profileId", profileId);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.authUrl) {
      window.location.href = data.authUrl;
    } else {
      console.error("No authUrl returned from GetLate API", data);
    }
  } catch (error) {
    console.error("Error connecting to platform:", error);
  }
};

export const postContent = async (
  platform: string,
  content: string,
  walletAddress: string,
) => {
  try {
    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, content, walletAddress }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting content:", error);
    return { error: "Failed to post content" };
  }
};
