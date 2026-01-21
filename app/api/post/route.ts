import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Or service role if needed for better security
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, content, walletAddress, prompt } = body;

    if (!platform || !content || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // 1. Get the connection info for this user/platform
    // We trust walletAddress from client? Ideally we verify auth, but for this demo/implementation:
    const { data: connection, error: dbError } = await supabase
      .from("user_connections")
      .select("account_id")
      .eq("wallet_address", walletAddress)
      .eq("platform", platform)
      .single();

    if (dbError || !connection) {
      return NextResponse.json(
        {
          error: "No connection found for this platform. Please connect first.",
        },
        { status: 404 },
      );
    }

    // 2. Prepare payload for GetLate
    const payload = {
      content: content,
      mediaItems: [], // No media for now
      platforms: [
        {
          platform: platform,
          accountId: connection.account_id,
        },
      ],
      publishNow: true,
    };

    // 3. Post to GetLate
    const response = await fetch("https://getlate.dev/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GETLATE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GetLate API Error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to post to GetLate" },
        { status: response.status },
      );
    }

    // 4. Optionally save to saved_content if successful
    // The existing 'PreviewPanel' saves, but maybe we should record that it was posted?
    // User asked "langsung aja post".

    return NextResponse.json({ success: true, result: data });
  } catch (error) {
    console.error("Error posting content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
