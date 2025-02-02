import { signInAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { InputText } from "primereact/inputtext";

export default function Login() {
  return (
    <div className="border-primary p-6">
      <form className="flex flex-col w-full max-w-sm">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <label htmlFor="email">Email</label>
        <InputText name="email" placeholder="" required />
        <div className="flex justify-between items-center">
          <label htmlFor="password">Password</label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <InputText
          type="password"
          name="password"
          placeholder=""
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Submit
        </SubmitButton>
      </div>
    </form>
    </div>
  );
}
