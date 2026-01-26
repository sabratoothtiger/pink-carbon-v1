import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SupabaseUser } from "@/lib/supabase/types";
import Shell from "./shell";

interface AuthenticatedShellProps {
  children: React.ReactNode;
  accountId?: string;
  requireAccountAccess?: boolean;
}

export default async function AuthenticatedShell({ 
  children,  
  accountId,
  requireAccountAccess = false 
}: AuthenticatedShellProps) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const supabaseUser = user as SupabaseUser;

  // Fetch all user account access data in one query
  const { data: accountUsersData, error: accountUsersError } = await supabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id);

  if (accountUsersError) {
    console.error('Error fetching user accounts:', accountUsersError);
    return redirect("/account");
  }

  const userAccountIds = accountUsersData?.map(au => au.account_id) || [];
  const hasMultipleAccounts = userAccountIds.length > 1;

  // If account access is required, verify user has access
  if (requireAccountAccess && accountId) {
    if (!userAccountIds.includes(parseInt(accountId))) {
      console.error('User does not have access to this account');
      return redirect("/account");
    }
  }

  // Fetch current account data if we're in an account context
  let currentAccount = null;
  if (accountId) {
    const { data: accountData } = await supabase
      .from('accounts')
      .select('id, display_name')
      .eq('id', accountId)
      .single();
    
    currentAccount = accountData;
  }

  return (
    <Shell 
      user={supabaseUser} 
      hasMultipleAccounts={hasMultipleAccounts}
      currentAccount={currentAccount}
      userAccountIds={userAccountIds}
    >
      {children}
    </Shell>
  );
}