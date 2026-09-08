import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthenticatedShell from "@/components/navigation_shell/authenticated-shell";
import AdminNav from "@/components/admin/admin-nav";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const supabase = await createClient();
  const { id: accountId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Verify user has access to this account, and that they're an admin.
  // This guards every page under /account/[id]/admin/*, not just this one -
  // hiding the nav link elsewhere isn't enough since a staff user could
  // otherwise reach any admin sub-page directly by URL.
  const { data: accountUserData, error: accountUserError } = await supabase
    .from('account_users')
    .select('account_id, role')
    .eq('user_id', user.id)
    .eq('account_id', accountId)
    .single();

  if (accountUserError || !accountUserData) {
    console.error('User does not have access to this account:', accountUserError);
    return redirect("/account");
  }

  if (accountUserData.role !== 'admin') {
    console.error('User does not have admin access to this account');
    return redirect(`/account/${accountId}/workqueue`);
  }

  return (
    <AuthenticatedShell accountId={accountId} requireAccountAccess={true}>
      <div className="max-w-6xl mx-auto flex gap-6">
        <AdminNav accountId={accountId} />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </AuthenticatedShell>
  );
}
