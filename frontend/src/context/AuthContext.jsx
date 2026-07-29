import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { syncUserWithBackend } from '../services/userService'

// ─── State ───────────────────────────────────────────────────
const initialState = {
  firebaseUser: null,
  dbUser:       null,
  loading:      true,
  error:        null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':   return { ...state, loading: action.payload }
    case 'SET_ERROR':     return { ...state, error: action.payload, loading: false }
    case 'SIGN_IN':       return { ...state, firebaseUser: action.firebaseUser, dbUser: action.dbUser, loading: false, error: null }
    case 'SIGN_OUT':      return { ...initialState, loading: false }
    default:              return state
  }
}

// ─── Context ─────────────────────────────────────────────────
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token  = await firebaseUser.getIdToken()
          const dbUser = await syncUserWithBackend(token)
          dispatch({ type: 'SIGN_IN', firebaseUser, dbUser })
        } catch (err) {
          console.error('Failed to sync user with backend:', err)
          dispatch({ type: 'SIGN_IN', firebaseUser, dbUser: null })
        }
      } else {
        dispatch({ type: 'SIGN_OUT' })
      }
    })
    return unsubscribe
  }, [])

  // ─── Auth actions ─────────────────────────────────────────
  const loginWithEmail = useCallback(async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      throw err
    }
  }, [])

  const registerWithEmail = useCallback(async (email, password, displayName) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      return result
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      throw err
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }, [])

  const value = {
    ...state,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    clearError,
    isAuthenticated: !!state.firebaseUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
