import WorkqueueTable from "@/components/workqueue/table";
import AuthenticatedShell from "@/components/navigation_shell/authenticated-shell";
import { createClient } from "@/lib/supabase/server";

interface WorkqueuePageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    item?: string;
  }>;
}

export default async function WorkqueuePage({ params, searchParams }: WorkqueuePageProps) {
  const { id: accountId } = await params;
  const { item: selectedItemId } = await searchParams;
  
  const supabase = await createClient();

  // Get account details for the page title
  const { data: accountData } = await supabase
    .from('accounts')
    .select('id, display_name')
    .eq('id', accountId)
    .single();

  // Get user ID for the WorkqueueTable
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.user_metadata?.sub;

  return (
    <AuthenticatedShell 
      accountId={accountId} 
      requireAccountAccess={true}
    >
          <WorkqueueTable 
            userId={userId} 
            accountId={parseInt(accountId)} 
            selectedItemId={selectedItemId}
          />
    </AuthenticatedShell>
  );
}
