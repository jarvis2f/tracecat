import React from "react"
import { redirect } from "next/navigation"

import { getServerSession } from "@/lib/auth"
import Login from "@/components/auth/login"

export default async function HomePage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const session = await getServerSession()

  if (session) {
    return redirect("/workflows")
  }

  return <Login searchParams={searchParams} />
}
