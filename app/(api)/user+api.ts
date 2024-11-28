import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Log the entire request body for debugging
    const body = await request.json();
    console.log("Received body:", body);

    const { name, email, clerkId } = body;

    // More detailed validation
    if (!name || !email || !clerkId) {
      console.error("Missing fields:", { name, email, clerkId });
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: { name: !!name, email: !!email, clerkId: !!clerkId },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        },
      );
    }

    try {
      await sql`
        INSERT INTO users (
          name,
          email,
          clerk_id
        ) VALUES (
          ${name},
          ${email},
          ${clerkId}
        )
      `;

      return new Response(JSON.stringify({ message: "User added successfully" }), {
        status: 201,
      });
    } catch (dbError) {
      console.error("Database insertion error:", dbError);
      return new Response(
        JSON.stringify({
          error: "Failed to add user",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        }),
        {
          status: 500,
        },
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Unexpected server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
