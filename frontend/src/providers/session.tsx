"use client"

import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useRouter } from "next/navigation"

import { Session } from "@/lib/auth"

export type SessionContext =
  | {
      isLoading: true
      session: null
      error: null
      signOut: () => void
    }
  | {
      isLoading: false
      session: Session
      error: null
      signOut: () => void
    }
  | {
      isLoading: false
      session: null
      error: Error
      signOut: () => void
    }

const SessionContext = createContext<SessionContext>({
  isLoading: true,
  session: null,
  error: null,
  signOut: () => {},
})

export interface SessionContextProviderProps {
  initialSession?: Session | null
}

export const SessionContextProvider = ({
  initialSession = null,
  children,
}: PropsWithChildren<SessionContextProviderProps>) => {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isLoading, setIsLoading] = useState<boolean>(!initialSession)
  const [error, setError] = useState<Error>()
  const router = useRouter()

  useEffect(() => {
    if (!session && initialSession) {
      setSession(initialSession)
    }
  }, [session, initialSession])

  useEffect(() => {
    const storedSession = localStorage.getItem("session")
    if (storedSession) {
      try {
        const parsedSession: Session = JSON.parse(storedSession)
        setSession(parsedSession)
      } catch (error) {
        console.error(
          "An error occurred while parsing stored session information",
          error
        )
      }
    }
    setIsLoading(false)
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem("session")
    setSession(null)
    router.push("/")
    router.refresh()
  }, [])

  const value: SessionContext = useMemo(() => {
    if (isLoading) {
      return {
        isLoading: true,
        session: null,
        error: null,
        signOut,
      }
    }
    if (error) {
      return {
        isLoading: false,
        session: null,
        error,
        signOut,
      }
    }
    return {
      isLoading: false,
      session: session!,
      error: null,
      signOut,
    }
  }, [isLoading, session, error])

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export const useSessionContext = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error(
      `useSessionContext must be used within a SessionContextProvider.`
    )
  }
  return context
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error(`useSession must be used within a SessionContextProvider.`)
  }
  return context.session
}

export const useUser = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a SessionContextProvider.`)
  }
  return context.session?.user ?? null
}
