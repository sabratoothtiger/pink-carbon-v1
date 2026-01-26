import Shell from "@/components/navigation_shell/shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "primereact/button";
import Link from "next/link";
import AuthenticatedShell from "@/components/navigation_shell/authenticated-shell";

export default async function GlobalAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get all accounts for the user
  const { data: accountUsersData, error: accountUsersError } = await supabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id);

  if (accountUsersError || !accountUsersData || accountUsersData.length === 0) {
    console.error('Failed to fetch account data:', accountUsersError);
    return redirect("/account");
  }

  // Get account details
  const accountIds = accountUsersData.map(au => au.account_id);
  const { data: accountsData, error: accountsError } = await supabase
    .from('accounts')
    .select('id, display_name, created_at')
    .in('id', accountIds);

  function AdminContent() {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Global Administration
          </h1>
          <p className="text-text-secondary">
            Manage settings across all your organizations
          </p>
        </div>

        {/* Global Admin Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Profile */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-user text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">Profile</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Manage your personal account settings and preferences.
            </p>
            <Button 
              label="Manage Profile" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>

          {/* Security */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-shield text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">Security</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Manage passwords, two-factor authentication, and security settings.
            </p>
            <Button 
              label="Security Settings" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>

          {/* Notifications */}
          <div className="bg-surface-a border border-surface-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="pi pi-bell text-pink-500 text-2xl" />
              <h3 className="text-lg font-semibold text-primary">Notifications</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Configure notification preferences across all organizations.
            </p>
            <Button 
              label="Notification Settings" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              className="p-button-sm w-full"
              disabled
            />
          </div>
        </div>

        {/* Organizations */}
        <div className="bg-surface-a border border-surface-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <i className="pi pi-building text-pink-500" />
            Organization Administration
          </h2>
          <p className="text-text-secondary mb-6">
            Quick access to admin settings for each organization you have access to.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accountsData?.map((account) => (
              <div key={account.id} className="bg-surface-b border border-surface-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-primary">{account.display_name}</h3>
                  <i className="pi pi-building text-pink-500" />
                </div>
                <div className="text-xs text-text-secondary mb-3">
                  Created {new Date(account.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Link href={`/account/account/${account.id}/workqueue`} className="flex-1">
                    <Button 
                      label="Workqueue" 
                      icon="pi pi-list" 
                      className="p-button-sm w-full p-button-secondary"
                    />
                  </Link>
                  <Link href={`/account/account/${account.id}/admin`} className="flex-1">
                    <Button 
                      label="Admin" 
                      icon="pi pi-cog" 
                      className="p-button-sm w-full"
                    />
                  </Link>
                </div>
              </div>
            ))}
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