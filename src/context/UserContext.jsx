import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [name, setName] = useState('Amina Lee')

  useEffect(() => {
    const stored = localStorage.getItem('bb-user-name')
    if (stored) setName(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem('bb-user-name', name)
  }, [name])

  const value = useMemo(() => ({ name, setName }), [name])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
