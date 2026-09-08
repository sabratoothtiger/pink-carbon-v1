import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ExportsPage from "@/components/admin/exports-page";

interface AdminExportsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminExports({ params }: AdminExportsPageProps) {
  const { id: accountId } = await params;
  const supabase = await createClient();

  // Access and role are already enforced by the admin layout; this fetch is
  // just for the account's display name (used in the export filename).
  const { data: accountData, error: accountError } = await supabase
    .from("accounts")
    .select("id, display_name")
    .eq("id", accountId)
    .single();

  if (accountError || !accountData) {
    console.error("Failed to fetch account details:", accountError);
    return redirect("/account");
  }

  return <ExportsPage accountId={parseInt(accountId)} accountName={accountData.display_name} />;
}
