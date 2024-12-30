import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { EnvVarWarning } from "@/components/env-var-warning";
import Hero from "@/components/home-page/hero";
import Footer from "@/components/home-page/footer";
import Header from "@/components/home-page/header";


export default async function Index() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 mt-10">
        <div className="flex justify-center">
          {!hasEnvVars ? <EnvVarWarning /> : <></>}
        </div>
        <Header />
        <Hero />
        <Footer />
      </main>
    </>
  );
}
