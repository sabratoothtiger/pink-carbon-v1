import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function GET(request) {
  const url = new URL(request.url);
  const subdomain = url.searchParams.get("subdomain");
  const return_year = url.searchParams.get("return_year");
  const identifier = url.searchParams.get("identifier");

  try {
    const { data, error } = await supabase.rpc("get_status_by_identifier", {
      subdomain: subdomain,
      return_year: return_year,
      four_digit_number: identifier,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
