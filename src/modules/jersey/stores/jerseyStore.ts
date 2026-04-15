import { create } from 'zustand'
import type { JerseyWithImage, JerseyFormData } from '../types/jersey'

const API_BASE_URL = '/api'

interface JerseyState {
  jerseys: JerseyWithImage[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  sortBy: 'createdAt' | 'likes' | 'price'
  sortOrder: 'asc' | 'desc'
  fetchJerseys: () => Promise<void>
  createJersey: (data: JerseyFormData) => Promise<JerseyWithImage | null>
  updateJersey: (id: number, data: Partial<JerseyFormData>) => Promise<void>
  deleteJersey: (id: number) => Promise<void>
  likeJersey: (id: number) => Promise<void>
  uploadImage: (id: number, file: File) => Promise<void>
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: 'createdAt' | 'likes' | 'price') => void
  setSortOrder: (order: 'asc' | 'desc') => void
}

export const useJerseyStore = create<JerseyState>((set, get) => ({
  jerseys: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',

  fetchJerseys: async () => {
    set({ isLoading: true, error: null })
    try {
      const { searchQuery, sortBy, sortOrder } = get()
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      params.append('sortBy', sortBy)
      params.append('order', sortOrder)

      const response = await fetch(`${API_BASE_URL}/jerseys?${params}`)
      if (!response.ok) throw new Error('Failed to fetch jerseys')

      const jerseys = await response.json()
      set({ jerseys, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch jerseys', isLoading: false })
    }
  },

  createJersey: async (data) => {
    try {
      // Optimistic update
      const tempId = Date.now()
      const tempJersey: JerseyWithImage = {
        id: tempId,
        ...data,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasImage: false,
      }
      set({ jerseys: [...get().jerseys, tempJersey] })

      const response = await fetch(`${API_BASE_URL}/jerseys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create jersey')

      const jersey = await response.json()
      set({
        jerseys: get().jerseys.map(j => j.id === tempId ? jersey : j)
      })
      return jersey
    } catch (error) {
      set({ error: 'Failed to create jersey' })
      await get().fetchJerseys() // Rollback
      return null
    }
  },

  updateJersey: async (id, data) => {
    try {
      // Optimistic update
      const currentJerseys = get().jerseys
      set({
        jerseys: currentJerseys.map(j =>
          j.id === id ? { ...j, ...data, updatedAt: new Date().toISOString() } : j
        )
      })

      const response = await fetch(`${API_BASE_URL}/jerseys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update jersey')

      const jersey = await response.json()
      set({
        jerseys: get().jerseys.map(j => j.id === id ? jersey : j)
      })
    } catch (error) {
      set({ error: 'Failed to update jersey' })
      await get().fetchJerseys() // Rollback
    }
  },

  deleteJersey: async (id) => {
    try {
      // Optimistic update
      set({ jerseys: get().jerseys.filter(j => j.id !== id) })

      const response = await fetch(`${API_BASE_URL}/jerseys/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete jersey')
    } catch (error) {
      set({ error: 'Failed to delete jersey' })
      await get().fetchJerseys() // Rollback
    }
  },

  likeJersey: async (id) => {
    try {
      // Optimistic update
      set({
        jerseys: get().jerseys.map(j =>
          j.id === id ? { ...j, likes: j.likes + 1 } : j
        )
      })

      const response = await fetch(`${API_BASE_URL}/jerseys/${id}/like`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to like jersey')

      const jersey = await response.json()
      set({
        jerseys: get().jerseys.map(j => j.id === id ? jersey : j)
      })
    } catch (error) {
      set({ error: 'Failed to like jersey' })
      await get().fetchJerseys() // Rollback
    }
  },

  uploadImage: async (id, file) => {
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      await new Promise<void>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const imageData = reader.result as string
            const response = await fetch(`${API_BASE_URL}/jerseys/${id}/image`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageData,
                contentType: file.type,
              }),
            })

            if (!response.ok) throw new Error('Failed to upload image')

            set({
              jerseys: get().jerseys.map(j =>
                j.id === id ? { ...j, hasImage: true } : j
              )
            })
            resolve()
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
      })
    } catch (error) {
      set({ error: 'Failed to upload image' })
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
}))
