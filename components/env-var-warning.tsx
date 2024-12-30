import React from "react";
import { InfoIcon } from "lucide-react";

export function EnvVarWarning() {
  return (
    <React.Fragment>
      {/* Supabase environment variables required message*/}
      <div className="bg-pink-400 text-sm p-3 px-5 text-foreground flex gap-3 items-center justify-center w-full fixed top-0 left-0 z-50">
        <InfoIcon size="16" strokeWidth={2} />
        Uh oh! Database credentials are missing. Content will not load as
        expected.
      </div>
    </React.Fragment>
  );
}
