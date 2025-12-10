import { useState, useEffect } from 'react'

/**
 * A hook that persists state to localStorage
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - The default value if nothing is stored
 * @returns {[*, Function]} - The state and setter function
 */
export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // Storage full or disabled - silently fail
    }
  }, [key, state])

  return [state, setState]
}

/**
 * A hook specifically for persisting game settings
 * @param {Object} defaultSettings - Default game settings
 * @returns {[Object, Function]} - Settings and setter
 */
export function usePersistedSettings(defaultSettings) {
  return usePersistedState('puzzle-game-settings', defaultSettings)
}
