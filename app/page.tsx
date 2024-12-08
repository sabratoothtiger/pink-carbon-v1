import AuthButtons from "@/components/auth-buttons";
import { EnvVarWarning } from "@/components/env-var-warning";
import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 mt-10">
        <Hero />
        <div className="flex justify-center">
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButtons />}
        </div>
      </main>
    </>
  );
}
