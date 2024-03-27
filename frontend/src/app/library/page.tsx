import React from "react"
import { redirect } from "next/navigation"

import { getServerSession } from "@/lib/auth"
import { Library } from "@/components/library/workflow-catalog"
import Navbar from "@/components/nav/navbar"

export default async function Page() {
  const session = await getServerSession()
  if (!session) {
    redirect("/")
  }
  return (
    <div className="no-scrollbar flex h-screen max-h-screen flex-col">
      <Navbar session={session} />
      <Library session={session} />
    </div>
  )
}
