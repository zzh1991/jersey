import { memo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { MagnifyingGlassPlus, MagnifyingGlassMinus, X } from '@phosphor-icons/react'
import { cn } from '@/shared/lib/utils'

interface ImageLightboxProps {
  src: string
  isOpen: boolean
  onClose: () => void
  alt?: string
}

// Spring physics for natural motion
const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

// Smoother exit animation with spring physics
const exitSpringConfig = {
  type: 'spring',
  stiffness: 400,
  damping: 35,
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } },
}

const imageVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 20,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      ...springConfig,
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: 15,
    transition: {
      ...exitSpringConfig,
      opacity: { duration: 0.15 },
    },
  },
}

const controlsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.15, ...springConfig },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
}

export default memo(function ImageLightbox({ src, isOpen, onClose, alt = '' }: ImageLightboxProps) {
  const controlsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Use refs for scale to avoid re-renders
  const scaleRef = useRef(1)

  // Spring-based scale for smooth transitions
  const springScale = useSpring(1, springConfig)
  const displayScale = useTransform(springScale, (s) => s)

  const handleClose = useCallback(() => {
    springScale.set(1)
    scaleRef.current = 1
    onClose()
  }, [onClose, springScale])

  const handleZoomIn = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const newScale = Math.min(scaleRef.current + 0.5, 3)
    scaleRef.current = newScale
    springScale.set(newScale)
  }, [springScale])

  const handleZoomOut = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const newScale = Math.max(scaleRef.current - 0.5, 0.5)
    scaleRef.current = newScale
    springScale.set(newScale)
  }, [springScale])

  // Update scale from keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose()
          break
        case '+':
        case '=':
          handleZoomIn({ stopPropagation: () => {} } as React.MouseEvent)
          break
        case '-':
          handleZoomOut({ stopPropagation: () => {} } as React.MouseEvent)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose, handleZoomIn, handleZoomOut])

  // Global click handler for reliable close
  useEffect(() => {
    if (!isOpen) return

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (controlsRef.current?.contains(target)) {
        return
      }
      handleClose()
    }

    document.addEventListener('click', handleGlobalClick, true)
    return () => document.removeEventListener('click', handleGlobalClick, true)
  }, [isOpen, handleClose])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Wheel zoom support
  useEffect(() => {
    if (!isOpen) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.25 : 0.25
      const newScale = Math.max(0.5, Math.min(3, scaleRef.current + delta))
      scaleRef.current = newScale
      springScale.set(newScale)
    }

    const lightboxEl = document.querySelector('[data-lightbox]')
    if (lightboxEl) {
      lightboxEl.addEventListener('wheel', handleWheel, { passive: false })
      return () => lightboxEl.removeEventListener('wheel', handleWheel)
    }
  }, [isOpen, springScale])

  // Reset scale when closed
  useEffect(() => {
    if (!isOpen) {
      scaleRef.current = 1
      springScale.set(1)
    }
  }, [isOpen, springScale])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-lightbox
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={handleClose}
        >
          {/* Subtle grid pattern for depth */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Close button - top right */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12 } }}
            transition={{ delay: 0.1, ...springConfig }}
            onClick={handleClose}
            className="absolute top-4 right-4 z-[110] p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Zoom controls */}
          <motion.div
            ref={controlsRef}
            variants={controlsVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-1 p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleZoomOut}
              disabled={scaleRef.current <= 0.5}
              className={cn(
                'p-2.5 sm:p-2 rounded-full transition-all duration-200 cursor-pointer',
                scaleRef.current <= 0.5
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95'
              )}
            >
              <MagnifyingGlassMinus className="w-5 h-5" />
            </button>
            <span className="text-xs sm:text-sm text-white/80 min-w-[50px] sm:min-w-[60px] text-center font-mono">
              {Math.round(scaleRef.current * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scaleRef.current >= 3}
              className={cn(
                'p-2.5 sm:p-2 rounded-full transition-all duration-200 cursor-pointer',
                scaleRef.current >= 3
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95'
              )}
            >
              <MagnifyingGlassPlus className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Image container with overflow hidden for smooth scaling */}
          <motion.div
            className="relative flex items-center justify-center"
            onClick={e => e.stopPropagation()}
            style={{
              overflow: 'hidden',
              maxWidth: '95vw',
              maxHeight: '80dvh',
            }}
          >
            <motion.img
              ref={imageRef}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              src={src}
              alt={alt}
              style={{
                scale: displayScale,
                maxHeight: '80dvh',
                maxWidth: '95vw',
              }}
              className="object-contain select-none"
              draggable={false}
              transition={springConfig}
            />
          </motion.div>

          {/* Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ delay: 0.3 }}
            className="fixed bottom-20 sm:bottom-22 left-1/2 -translate-x-1/2 text-xs text-white/40 z-[110] pointer-events-none"
          >
            点击背景或按 ESC 关闭 - 滚轮缩放
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})