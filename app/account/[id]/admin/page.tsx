import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "primereact/button";
import Link from "next/link";
import { SupabaseUser } from "@/lib/supabase/types";
import AuthenticatedShell from "@/components/navigation_shell/authenticated-shell";

interface AdminPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const supabase = await createClient();
  const { id: accountId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Verify user has access to this account
  const { data: accountUserData, error: accountUserError } = await supabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .eq('account_id', accountId)
    .single();

  if (accountUserError || !accountUserData) {
    console.error('User does not have access to this account:', accountUserError);
    return redirect("/account");
  }

  // Get account details
  const { data: accountData, error: accountError } = await supabase
    .from('accounts')
    .select('id, display_name')
    .eq('id', accountId)
    .single();

  if (accountError || !accountData) {
    console.error('Failed to fetch account details:', accountError);
    return redirect("/account");
  }

  function AdminContent() {
    return (
      <div className="max-w-6xl mx-auto">

        {/* Admin Content Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Management */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-users text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">Users</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Manage user access and permissions for this organization.
            </p>
            <Button 
              label="Manage Users" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>

          {/* Settings */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-cog text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">Settings</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Configure organization settings and preferences.
            </p>
            <Button 
              label="View Settings" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>

          {/* Reports */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-chart-bar text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">Reports</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Generate and view reports for this organization.
            </p>
            <Button 
              label="View Reports" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>

          {/* Billing */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-credit-card text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">Billing</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Manage billing and subscription information.
            </p>
            <Button 
              label="View Billing" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>

          {/* API Keys */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-key text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">API Keys</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Manage API keys and integrations.
            </p>
            <Button 
              label="Manage Keys" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>

          {/* Audit Log */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-list text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">Audit Log</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              View activity and change history.
            </p>
            <Button 
              label="View Log" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthenticatedShell>
      <AdminContent />
    </AuthenticatedShell>
  );
}
