import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { InputText } from "primereact/inputtext";

export default function Signup() {
  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <label htmlFor="firstName">First name</label>
          <InputText name="firstName" placeholder="" required />
          <label htmlFor="email">Email</label>
          <InputText name="email" placeholder="" required />
          <label htmlFor="password">Password</label>
          <InputText
            type="password"
            name="password"
            placeholder=""
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
