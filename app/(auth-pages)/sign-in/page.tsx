import { signInAction } from "@/app/actions"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage, type Message } from "@/components/form-message"
import Link from "next/link"

export default async function SignIn({ searchParams }: { searchParams: Promise<Message> }) {
  const message = await searchParams
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Welcome back!</h2>
        <p className="mt-2 text-gray-300">Sign in to your Pink Carbon account</p>
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

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md px-1"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-slate-800/50 backdrop-blur-sm transition-all text-white placeholder-gray-400"
            placeholder="••••••••"
          />
        </div>

        <SubmitButton
          formAction={signInAction}
          className="p-button bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 w-full"
          pendingText="Signing in..."
        >
          Sign In
        </SubmitButton>
      </form>

      <div className="text-center">
        <p className="text-gray-300">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-pink-400 hover:text-pink-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md px-1"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}
