import { createContext, useEffect, useState, useCallback } from 'react'
import supabase from '../Supabase'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const signUp = useCallback(
        (data) => supabase.auth.signUp(data),
        []
    )

    const signInWithPassword = useCallback(
        ({ email, password }) => supabase.auth.signInWithPassword({ email, password }),
        []
    )

    const signInWithOtp = useCallback(
        ({ email }) => supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false }
        }),
        []
    )

    const signOut = useCallback(
        () => supabase.auth.signOut(),
        []
    )

    const resetPasswordForEmail = useCallback(
        (email) => supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        }),
        []
    )

    const updatePassword = useCallback(
        (password) => supabase.auth.updateUser({ password }),
        []
    )

    useEffect(() => {
        let subscription

        async function getSession() {
            try {
                setLoading(true)
                const { data: { session } } = await supabase.auth.getSession()
                setUser(session?.user ?? null)

                const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN') {
                        setUser(session?.user ?? null)
                    } else if (event === 'SIGNED_OUT') {
                        setUser(null)
                    }
                })

                subscription = sub
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getSession()

        return () => subscription?.unsubscribe()
    }, [])

    const value = {
        signUp,
        signInWithPassword,
        signInWithOtp,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        user,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
