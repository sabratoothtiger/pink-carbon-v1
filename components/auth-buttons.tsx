import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "primereact/badge";

export default async function AuthButtons() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge value='Please update .env.local file with anon key and url'></Badge>
          </div>
          <div className="flex gap-2">
            <a href="/sign-in" className="p-button p-button-outlined">
              Sign in
            </a>
            <a href="/sign-up" className="p-button">
              Sign up
            </a>
          </div>
        </div>
      </>
    );
  }

  return user ? (
    <>
      <div className="flex items-center gap-4">
        Hey, {user.email}!
        <form action={signOutAction}>
          <button 
            type="submit" 
            className="p-button p-button-outlined"
          >
            Sign out
          </button>
        </form>
      </div>
    </>
  ) : (
    <>
      <div className="flex gap-2">
        <a href="/sign-in" className="p-button p-button-secondary">
          Sign in
        </a>
        <a href="/sign-up" className="p-button">
          Sign up
        </a>
      </div>
    </>
  );
}