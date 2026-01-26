import { forgotPasswordAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, type Message } from "@/components/form-message";
import Link from "next/link";

export default async function ForgotPassword({ searchParams }: { searchParams: Promise<Message> }) {
  const message = await searchParams;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Reset your password</h2>
        <p className="mt-2 text-gray-300">Enter your email to receive a reset link</p>
      </div>

      <FormMessage message={message} />

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-slate-800/50 backdrop-blur-sm transition-all text-white placeholder-gray-400"
            placeholder="you@example.com"
          />
        </div>

        <SubmitButton
          formAction={forgotPasswordAction}
          className="p-button bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 w-full"
          pendingText="Sending reset email..."
        >
          Send Reset Email
        </SubmitButton>
      </form>

      <div className="text-center">
        <p className="text-gray-300">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="text-pink-400 hover:text-pink-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md px-1"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
