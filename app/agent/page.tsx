import AgentToolbar from "@/components/agent-toolbar";
import Workqueue from "@/components/data-table";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { SupabaseUser } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Type assertion to match the SupabaseUser type
  const supabaseUser = user as SupabaseUser;

  const supabaseSession = supabase.auth.getSession();  // Get the session object that contains access_token

  return (
    <div className="flex-1 w-full flex flex-col ">
      {/* Protected page page */}
      {/* <div className="bg-pink-400 text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center justify-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
      </div> */}
      <AgentToolbar user={supabaseUser}/>
      <div className="w-full p-6">
        <Workqueue user={supabaseUser}/>
      </div>
      {/* User details display */}
      {/* <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div> */}
    </div>
  );
}
