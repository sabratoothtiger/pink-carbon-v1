import Shell from "@/components/navigation_shell/shell";
import { SupabaseUser } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import Link from "next/link";

interface AccountPageProps {
  // No params needed for /account route
}

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

interface Account {
  id: string;
  display_name: string;
  created_at: string;
}

  // Fetch ALL accounts for the user
  const { data: accountUsersData, error: accountUsersError } = await supabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id);

  if (accountUsersError || !accountUsersData || accountUsersData.length === 0) {
    console.error('Failed to fetch account data:', accountUsersError);
    return redirect("/sign-in");
  }

  // Get account details for all user's accounts
  const accountIds = accountUsersData.map(au => au.account_id);
  const { data: accountsData, error: accountsError } = await supabase
    .from('accounts')
    .select('id, display_name, created_at')
    .in('id', accountIds);

  if (accountsError || !accountsData) {
    console.error('Failed to fetch account details:', accountsError);
    return redirect("/sign-in");
  }

  // If user has only one account, redirect directly to dashboard
  if (accountsData.length === 1) {
    const accountId = accountsData[0].id;
    return redirect(`/account/${accountId}/dashboard`);
  }

  // Multiple accounts - show selection interface
  function AccountSelection() {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Select Organization
          </h1>
          <p className="text-text-secondary">
            Choose the organization you want to access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountsData?.map((account: Account) => (
            <Card
              key={account.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border border-surface-border"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-primary">
                    {account.display_name}
                  </h3>
                  <i className="pi pi-building text-pink-500 text-2xl" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Created {new Date(account.created_at).toLocaleDateString()}
                  </span>
                  
                  <Link href={`/account/${account.id}/dashboard`}>
                    <Button 
                      label="Access" 
                      icon="pi pi-arrow-right" 
                      iconPos="right"
                      className="p-button-sm"
                    />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Shell user={user as SupabaseUser}>
      <AccountSelection />
    </Shell>
  )
}
