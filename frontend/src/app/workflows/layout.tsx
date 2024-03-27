import { Metadata } from "next"
import { WorkflowProvider } from "@/providers/workflow"

import { getServerSession } from "@/lib/auth"
import Navbar from "@/components/nav/navbar"

export const metadata: Metadata = {
  title: "Workflows | Tracecat",
}

export default async function WorkflowsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  return (
    <WorkflowProvider session={session}>
      <div className="no-scrollbar flex h-screen max-h-screen flex-col">
        <Navbar session={session} />
        {children}
      </div>
    </WorkflowProvider>
  )
}
