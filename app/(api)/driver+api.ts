import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  console.log("called");
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT * FROM drivers`; //select all from drivers

    return Response.json({ data: response });
  } catch (error) {
    console.log("error: ", error);
    return Response.json({ error });
  }
}
