export const connectToPlatform = (platform: string) => {
  // Logic to redirect to auth endpoint
  window.location.href = `/api/auth/${platform}`;
};

export const postContent = async (platform: string, content: string) => {
  try {
    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform,
        content,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to post content" };
    }

    return { success: true, result: data };
  } catch (error) {
    console.error("Error posting content:", error);
    return { error: "Internal server error" };
  }
};

export const openTwitterIntent = (content: string) => {
  const text = encodeURIComponent(content);
  const intentUrl = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(intentUrl, "_blank", "width=550,height=420");
};
