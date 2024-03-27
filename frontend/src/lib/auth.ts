"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { siteConfig } from "@/config/site"
import { createWorkflow } from "@/lib/flow"

export interface Session {
  access_token: string
  user: User
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string
}

export async function signInFlow(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: email, password }),
  })

  if (!response.ok) {
    console.error("login failed")
    return redirect("/?level=error&message=Username or password is incorrect")
  }

  const session: Session = await response.json()
  cookies().set("token", session.access_token)

  // await newUserFlow(session)

  return redirect("/workflows")
}

export async function newUserFlow(session: Session) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  })

  // If the user already exists, we'll get a 409 conflict
  if (!response.ok && response.status !== 409) {
    console.error("Failed to create user")
    return redirect("/?level=error&message=Could not authenticate user")
  }

  if (response.status !== 409) {
    console.log("New user created")
    await createWorkflow(
      session,
      "My first workflow",
      "Welcome to Tracecat. This is your first workflow!"
    )
    console.log("Created first workflow for new user")
  }
}

export async function getServerSession(): Promise<Session | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}
