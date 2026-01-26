import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, type Message } from "@/components/form-message";
import Link from "next/link";

export default async function Signup({ searchParams }: { searchParams: Promise<Message> }) {
  const message = await searchParams;
  const hasSuccessMessage = 'success' in message;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Create your account</h2>
        <p className="mt-2 text-gray-300">Join Pink Carbon today</p>
      </div>

      <FormMessage message={message} />

      {hasSuccessMessage ? (
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Check your email!</h3>
            <p className="text-sm">
              We've sent a verification link to your email address. Please click the link in the email to activate your account.
            </p>
            <p className="text-xs mt-2 text-green-600">
              Don't see the email? Check your spam folder or wait a few minutes for it to arrive.
            </p>
          </div>
          <Link
            href="/sign-in"
            className="inline-block text-pink-400 hover:text-pink-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md px-2 py-1"
          >
            Return to Sign In
          </Link>
        </div>
      ) : (
        <>
          <form className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                autoComplete="given-name"
                className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-slate-800/50 backdrop-blur-sm transition-all text-white placeholder-gray-400"
                placeholder="Enter your first name"
              />
            </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-slate-800/50 backdrop-blur-sm transition-all text-white placeholder-gray-400"
                placeholder="At least 6 characters"
              />
              <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters long</p>
            </div>

            <SubmitButton
              formAction={signUpAction}
              className="p-button bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 w-full"
              pendingText="Creating account..."
            >
              Create Account
            </SubmitButton>
          </form>

          <div className="text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-pink-400 hover:text-pink-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md px-1"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
