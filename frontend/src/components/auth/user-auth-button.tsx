import Link from "next/link"
import { redirect } from "next/navigation"

import { getServerSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function AuthButton() {
  const session = await getServerSession()
  const { user } = session

  const signOut = async () => {
    "use server"

    // const supabase = createClient()
    // await supabase.auth.signOut()
    return redirect("/")
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hi, {user.email}
      <form action={signOut}>
        <Button className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline">
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Link
      href="/"
      className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
    >
      Login
    </Link>
  )
}
