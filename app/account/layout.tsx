import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AccountLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id?: string;
  }>;
}

export default async function AccountLayout({ children, params }: AccountLayoutProps) {
  const supabase = await createClient();
  const { id: accountId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // If no accountId, this is the /account route (account selection page)
  if (!accountId) {
    return <>{children}</>;
  }

  // Verify user has access to this specific account
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

  return <>{children}</>;
}