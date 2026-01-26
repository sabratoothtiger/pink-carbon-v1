// Client Component client
// To access Supabase from Client Components, which run in the browser.

import { createBrowserClient } from '@supabase/ssr'

// Suppress client errors in dev environments
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalWarn = console.warn
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Multiple GoTrueClient instances detected")) {
      return // Suppress this specific warning
    }
    originalWarn.apply(console, args)
  }
}

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.length > 0

// Create a Supabase client for Client Components
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}