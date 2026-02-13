import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins, or specify "https://jmfcpallc.com" for specific domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

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
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
          }
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unexpected error occurred" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders,
        }
      }
    );
  }
}
