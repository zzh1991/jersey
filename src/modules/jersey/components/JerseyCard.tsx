import { useState, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Pencil, Trash, TShirt, MagnifyingGlassPlus } from '@phosphor-icons/react'
import { Button } from '@/shared/components/ui/button'
import ImageLightbox from '@/shared/components/ImageLightbox'
import { cn } from '@/shared/lib/utils'
import type { JerseyWithImage } from '../types/jersey'

interface JerseyCardProps {
  jersey: JerseyWithImage
  onEdit?: (jersey: JerseyWithImage) => void
  onDelete?: (id: number) => void
  onLike?: (id: number) => void
}

const brandLabels: Record<string, string> = {
  NIKE: 'Nike',
  ADIDAS: 'Adidas',
  PUMA: 'Puma',
  NEW_BALANCE: 'New Balance',
  UNDER_ARMOUR: 'Under Armour',
  KAPPA: 'Kappa',
  LOTTO: 'Lotto',
  DIADORA: 'Diadora',
  HUMMEL: 'Hummel',
  UMBRO: 'Umbro',
  MACRON: 'Macron',
  JOMA: 'Joma',
  ERREA: 'Errea',
  LE_COQ_SPORTIF: 'Le Coq Sportif',
  OTHER: '其他',
  nike: 'Nike',
  adidas: 'Adidas',
  puma: 'Puma',
  new_balance: 'New Balance',
  under_armour: 'Under Armour',
  kappa: 'Kappa',
  lotto: 'Lotto',
  diadora: 'Diadora',
  hummel: 'Hummel',
  umbro: 'Umbro',
  macron: 'Macron',
  joma: 'Joma',
  errea: 'Errea',
  le_coq_sportif: 'Le Coq Sportif',
  other: '其他',
}

const jerseyTypeLabels: Record<string, string> = {
  PLAYER: '球员版',
  FAN: '球迷版',
  player: '球员版',
  fan: '球迷版',
}

const clothingTypeLabels: Record<string, string> = {
  SHORT_SLEEVE: '短袖球衣',
  LONG_SLEEVE: '长袖球衣',
  HALF_ZIP_TRAINING: '半拉链训练服',
  SHORT_TRAINING: '短袖训练服',
  LONG_TRAINING: '长袖训练服',
  VEST: '背心',
  SHORTS: '短裤',
  LONG_PANTS: '训练长裤',
  short_sleeve: '短袖球衣',
  long_sleeve: '长袖球衣',
  half_zip_training: '半拉链训练服',
  short_training: '短袖训练服',
  long_training: '长袖训练服',
  vest: '背心',
  shorts: '短裤',
  long_pants: '训练长裤',
}

const matchTypeLabels: Record<string, string> = {
  HOME: '主场',
  AWAY_1: '一客',
  AWAY_2: '二客',
  AWAY_3: '三客',
  CUP: '杯赛',
  home: '主场',
  away_1: '一客',
  away_2: '二客',
  away_3: '三客',
  cup: '杯赛',
}

const showDeleteButton = import.meta.env.VITE_SHOW_DELETE_BUTTON === 'true'

export default memo(function JerseyCard({ jersey, onEdit, onDelete, onLike }: JerseyCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const imageUrl = jersey.hasImage
    ? `/api/jerseys/${jersey.id}/image`
    : null

  const handleEdit = useCallback(() => {
    onEdit?.(jersey)
  }, [jersey, onEdit])

  const handleDelete = useCallback(() => {
    onDelete?.(jersey.id)
  }, [jersey.id, onDelete])

  const handleLike = useCallback(() => {
    onLike?.(jersey.id)
  }, [jersey.id, onLike])

  const handleImageClick = useCallback(() => {
    if (imageUrl && !imageError) {
      setIsLightboxOpen(true)
    }
  }, [imageUrl, imageError])

  const handleLightboxClose = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-[#141416] border border-white/[0.06]',
        'transition-all duration-300',
        'hover:border-white/[0.12] hover:shadow-xl',
        'active:scale-[0.98] sm:active:scale-100'
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-white/[0.03] overflow-hidden">
        {imageUrl && !imageError ? (
          <>
            <img
              src={imageUrl}
              alt={jersey.name}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-300',
                isImageLoading ? 'opacity-0' : 'opacity-100',
                'cursor-zoom-in'
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setIsImageLoading(false)
                setImageError(true)
              }}
              onClick={handleImageClick}
            />
            {/* Zoom hint - visible on touch devices */}
            {!isImageLoading && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white/60 text-xs opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <MagnifyingGlassPlus className="w-3.5 h-3.5" />
                <span>点击放大</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <TShirt className="w-12 h-12 sm:w-16 sm:h-16 text-white/20" />
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={cn(
            'absolute top-2 right-2 sm:top-3 sm:right-3',
            'flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5',
            'bg-black/50 backdrop-blur-sm rounded-full',
            'text-white/80 hover:text-rose-400 hover:bg-black/70',
            'transition-all duration-200 active:scale-95'
          )}
        >
          <Heart weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
          <span className="text-xs sm:text-sm font-medium">{jersey.likes}</span>
        </button>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        src={imageUrl || ''}
        isOpen={isLightboxOpen}
        onClose={handleLightboxClose}
        alt={jersey.name}
      />

      {/* Content Section */}
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-white/90 line-clamp-1 mb-2">
          {jersey.name}
        </h3>

        {/* Tags - scrollable on mobile */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-md bg-slate-500/20 text-slate-400">
            {brandLabels[jersey.brand]}
          </span>
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-md bg-blue-500/20 text-blue-400">
            {jerseyTypeLabels[jersey.jerseyType]}
          </span>
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-md bg-emerald-500/20 text-emerald-400">
            {matchTypeLabels[jersey.matchType]}
          </span>
        </div>

        {/* Info - more compact on mobile */}
        <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-white/60 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white/40 shrink-0">{jersey.club}</span>
            <span className="text-white/20">|</span>
            <span>{jersey.season}</span>
          </div>
          {jersey.technology && (
            <div className="text-white/40 truncate">
              科技: {jersey.technology}
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/[0.06]">
          <span className="text-lg sm:text-xl font-bold text-white">
            ¥{Number(jersey.price).toFixed(0)}
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8 sm:h-9 sm:w-9 text-white/60 hover:text-white hover:bg-white/[0.08] active:scale-95"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            {showDeleteButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 sm:h-9 sm:w-9 text-white/60 hover:text-red-400 hover:bg-red-500/10 active:scale-95"
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})
