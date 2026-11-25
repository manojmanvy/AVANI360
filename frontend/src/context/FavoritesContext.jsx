import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useLocalStorage('avani360:favorites', [])

  const toggleFavorite = useCallback(
    (id) => {
      setFavoriteIds((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
      )
    },
    [setFavoriteIds],
  )

  const removeFavorite = useCallback(
    (id) => {
      setFavoriteIds((current) => current.filter((item) => item !== id))
    },
    [setFavoriteIds],
  )

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds])

  const value = useMemo(
    () => ({ favoriteIds, toggleFavorite, removeFavorite, isFavorite }),
    [favoriteIds, toggleFavorite, removeFavorite, isFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider')
  }
  return context
}
