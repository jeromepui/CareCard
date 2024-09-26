import { createContext, useEffect, useState } from 'react'
import supabase from '../Supabase'

export const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getSession() {
            setLoading(true)
            const {
                data: { session },
            } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)

            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    setUser(session?.user ?? null)
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                }
            })
            return () => subscription.unsubscribe()
        }

        getSession()
    }, [])

    const value = {
        signUp: data => supabase.auth.signUp(data),
        signIn: data => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
    }

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}