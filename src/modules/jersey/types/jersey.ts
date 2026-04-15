export type JerseyType = 'player' | 'fan'
export type ClothingType = 'short_sleeve' | 'long_sleeve' | 'half_zip_training' | 'short_training' | 'long_training' | 'vest' | 'shorts' | 'long_pants'
export type MatchType = 'home' | 'away_1' | 'away_2' | 'away_3' | 'cup'
export type Brand = 'nike' | 'adidas' | 'puma' | 'new_balance' | 'under_armour' | 'kappa' | 'lotto' | 'diadora' | 'hummel' | 'umbro' | 'macron' | 'joma' | 'errea' | 'le_coq_sportif' | 'other'

export interface Jersey {
  id: number
  name: string
  brand: Brand
  technology: string | null
  jerseyType: JerseyType
  clothingType: ClothingType
  club: string
  country: string
  matchType: MatchType
  year: number
  season: string
  price: number
  likes: number
  createdAt: string
  updatedAt: string
}

export interface JerseyWithImage extends Jersey {
  hasImage: boolean
}

export interface JerseyImage {
  id: number
  jerseyId: number
  imageData: string
  contentType: string
  createdAt: string
}

export interface JerseyFormData {
  name: string
  brand: Brand
  technology: string
  jerseyType: JerseyType
  clothingType: ClothingType
  club: string
  country: string
  matchType: MatchType
  year: number
  season: string
  price: number
}
