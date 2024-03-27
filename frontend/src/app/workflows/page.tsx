import React from "react"
import { redirect } from "next/navigation"

import { getServerSession } from "@/lib/auth"
import { WorkflowsDashboard } from "@/components/dashboard/workflows-dashboard"

export default async function Page() {
  const session = await getServerSession()
  if (!session) {
    redirect("/")
  }
  return <WorkflowsDashboard session={session} />
}
