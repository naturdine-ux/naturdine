import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, source = "popup" } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("subscribers")
      .insert({ email, source });

    if (error) {
      // Duplicate email — already subscribed
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Already subscribed!" },
          { status: 200 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "Subscribed successfully!" },
      { status: 200 }
    );

  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}