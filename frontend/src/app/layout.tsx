import "@/styles/globals.css"

import { Metadata } from "next"
import dynamic from "next/dynamic"
import { DefaultQueryClientProvider } from "@/providers/query"
import { SessionContextProvider } from "@/providers/session"

import { siteConfig } from "@/config/site"
import { getServerSession, Session } from "@/lib/auth"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  description: siteConfig.description,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

let PostHogPageView: any
let PHProvider: any

if (process.env.NEXT_PUBLIC_APP_ENV === "prod") {
  PostHogPageView = dynamic(
    () => import("@/components/analytics/PostHogPageView"),
    {
      ssr: false,
    }
  )
  PHProvider = require("@/providers/posthog").PHProvider
  console.log("PostHog initialized for production environment.")
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession()

  return (
    <>
      <html lang="en" className="h-full min-h-screen" suppressHydrationWarning>
        <head />
        {PHProvider ? (
          <PHProvider>
            <BodyContent session={session}>{children}</BodyContent>
          </PHProvider>
        ) : (
          <BodyContent session={session}>{children}</BodyContent>
        )}
      </html>
    </>
  )
}

function BodyContent({
  session,
  children,
}: {
  session: Session | null
  children: React.ReactNode
}) {
  return (
    <body
      className={cn(
        "h-screen min-h-screen overflow-hidden bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <SessionContextProvider initialSession={session}>
        <DefaultQueryClientProvider>
          {PostHogPageView && <PostHogPageView />}
          {children}
        </DefaultQueryClientProvider>
      </SessionContextProvider>
      <Toaster />
    </body>
  )
}
