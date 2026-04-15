import { useState, useCallback, useEffect, useRef } from 'react'
import { Upload, ClipboardText, MagnifyingGlassPlus } from '@phosphor-icons/react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select } from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import ImageLightbox from '@/shared/components/ImageLightbox'
import { cn } from '@/shared/lib/utils'
import type { JerseyWithImage, JerseyFormData, JerseyType, ClothingType, MatchType, Brand } from '../types/jersey'

interface JerseyFormProps {
  jersey?: JerseyWithImage | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: JerseyFormData, imageFile?: File) => void
}

const brands: { value: Brand; label: string }[] = [
  { value: 'nike', label: 'Nike' },
  { value: 'adidas', label: 'Adidas' },
  { value: 'puma', label: 'Puma' },
  { value: 'new_balance', label: 'New Balance' },
  { value: 'under_armour', label: 'Under Armour' },
  { value: 'kappa', label: 'Kappa' },
  { value: 'lotto', label: 'Lotto' },
  { value: 'diadora', label: 'Diadora' },
  { value: 'hummel', label: 'Hummel' },
  { value: 'umbro', label: 'Umbro' },
  { value: 'macron', label: 'Macron' },
  { value: 'joma', label: 'Joma' },
  { value: 'errea', label: 'Errea' },
  { value: 'le_coq_sportif', label: 'Le Coq Sportif' },
  { value: 'other', label: '其他' },
]

const jerseyTypes: { value: JerseyType; label: string }[] = [
  { value: 'player', label: '球员版' },
  { value: 'fan', label: '球迷版' },
]

const clothingTypes: { value: ClothingType; label: string }[] = [
  { value: 'short_sleeve', label: '短袖球衣' },
  { value: 'long_sleeve', label: '长袖球衣' },
  { value: 'half_zip_training', label: '半拉链训练服' },
  { value: 'short_training', label: '短袖训练服' },
  { value: 'long_training', label: '长袖训练服' },
  { value: 'vest', label: '背心' },
  { value: 'shorts', label: '短裤' },
  { value: 'long_pants', label: '训练长裤' },
]

const matchTypes: { value: MatchType; label: string }[] = [
  { value: 'home', label: '主场' },
  { value: 'away_1', label: '一客' },
  { value: 'away_2', label: '二客' },
  { value: 'away_3', label: '三客' },
  { value: 'cup', label: '杯赛' },
]

export default function JerseyForm({ jersey, isOpen, onClose, onSubmit }: JerseyFormProps) {
  const [formData, setFormData] = useState<JerseyFormData>({
    name: '',
    brand: 'other',
    technology: '',
    jerseyType: 'fan',
    clothingType: 'short_sleeve',
    club: '',
    country: '',
    matchType: 'home',
    year: new Date().getFullYear(),
    season: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    price: 0,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const imageUploadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (jersey) {
      setFormData({
        name: jersey.name,
        brand: jersey.brand.toLowerCase() as Brand,
        technology: jersey.technology || '',
        jerseyType: jersey.jerseyType.toLowerCase() as JerseyType,
        clothingType: jersey.clothingType.toLowerCase() as ClothingType,
        club: jersey.club,
        country: jersey.country,
        matchType: jersey.matchType.toLowerCase() as MatchType,
        year: jersey.year,
        season: jersey.season,
        price: Number(jersey.price),
      })
      if (jersey.hasImage) {
        setPreviewImage(`/api/jerseys/${jersey.id}/image`)
      }
    } else {
      setFormData({
        name: '',
        brand: 'other',
        technology: '',
        jerseyType: 'fan',
        clothingType: 'short_sleeve',
        club: '',
        country: '',
        matchType: 'home',
        year: new Date().getFullYear(),
        season: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        price: 0,
      })
      setPreviewImage(null)
    }
    setSelectedFile(null)
  }, [jersey, isOpen])

  const handleChange = useCallback((field: keyof JerseyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }, [])

  const processImageFile = useCallback((file: File) => {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          processImageFile(file)
          e.preventDefault()
          break
        }
      }
    }
  }, [processImageFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      processImageFile(file)
    }
  }, [processImageFile])

  // Listen for paste events when dialog is open
  useEffect(() => {
    if (isOpen) {
      const handlePasteEvent = (e: ClipboardEvent) => handlePaste(e)
      document.addEventListener('paste', handlePasteEvent)
      return () => {
        document.removeEventListener('paste', handlePasteEvent)
      }
    }
  }, [isOpen, handlePaste])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, selectedFile || undefined)
    onClose()
  }, [formData, selectedFile, onSubmit, onClose])

  const handleClose = useCallback(() => {
    setPreviewImage(null)
    setSelectedFile(null)
    setIsDragOver(false)
    setIsLightboxOpen(false)
    onClose()
  }, [onClose])

  const handlePreviewClick = useCallback(() => {
    if (previewImage) {
      setIsLightboxOpen(true)
    }
  }, [previewImage])

  const handleLightboxClose = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{jersey ? '编辑球衣' : '新增球衣'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>球衣图片</Label>
            <div
              ref={imageUploadRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative"
            >
              <label
                className={cn(
                  'flex flex-col items-center justify-center w-full h-36 sm:h-48',
                  'border-2 border-dashed rounded-xl',
                  'cursor-pointer',
                  'transition-all duration-200',
                  isDragOver
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : previewImage
                      ? 'border-white/[0.08] bg-white/[0.03]'
                      : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.05]'
                )}
              >
                {previewImage ? (
                  <div
                    onClick={handlePreviewClick}
                    className="w-full h-full flex items-center justify-center cursor-zoom-in"
                  >
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white/60 text-xs">
                      <MagnifyingGlassPlus className="w-3.5 h-3.5" />
                      <span>点击放大</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/[0.06]">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/[0.06]">
                        <ClipboardText className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-white/60 mb-1">
                      点击上传、拖拽或粘贴图片
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/40">
                      支持 JPG, PNG, GIF
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {previewImage && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null)
                    setSelectedFile(null)
                  }}
                  className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-black/50 text-white/60 hover:text-white hover:bg-black/70 transition-colors active:scale-95"
                >
                  移除
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Name */}
            <div className="space-y-1.5 sm:space-y-2 col-span-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">球衣名称</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="输入球衣名称"
                className="h-10 sm:h-11"
                required
              />
            </div>

            {/* Brand */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="brand" className="text-xs sm:text-sm">品牌</Label>
              <Select
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="h-10 sm:h-11"
              >
                {brands.map(brand => (
                  <option key={brand.value} value={brand.value}>{brand.label}</option>
                ))}
              </Select>
            </div>

            {/* Technology */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="technology" className="text-xs sm:text-sm">科技</Label>
              <Input
                id="technology"
                value={formData.technology}
                onChange={(e) => handleChange('technology', e.target.value)}
                placeholder="Dri-FIT 等"
                className="h-10 sm:h-11"
              />
            </div>

            {/* Jersey Type */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="jerseyType" className="text-xs sm:text-sm">球衣类型</Label>
              <Select
                id="jerseyType"
                value={formData.jerseyType}
                onChange={(e) => handleChange('jerseyType', e.target.value)}
                className="h-10 sm:h-11"
              >
                {jerseyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Select>
            </div>

            {/* Clothing Type */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="clothingType" className="text-xs sm:text-sm">衣服类型</Label>
              <Select
                id="clothingType"
                value={formData.clothingType}
                onChange={(e) => handleChange('clothingType', e.target.value)}
                className="h-10 sm:h-11"
              >
                {clothingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Select>
            </div>

            {/* Club */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="club" className="text-xs sm:text-sm">俱乐部</Label>
              <Input
                id="club"
                value={formData.club}
                onChange={(e) => handleChange('club', e.target.value)}
                placeholder="俱乐部名称"
                className="h-10 sm:h-11"
                required
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="country" className="text-xs sm:text-sm">国家</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="国家"
                className="h-10 sm:h-11"
                required
              />
            </div>

            {/* Match Type */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="matchType" className="text-xs sm:text-sm">场次类型</Label>
              <Select
                id="matchType"
                value={formData.matchType}
                onChange={(e) => handleChange('matchType', e.target.value)}
                className="h-10 sm:h-11"
              >
                {matchTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="year" className="text-xs sm:text-sm">年份</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                className="h-10 sm:h-11"
                required
              />
            </div>

            {/* Season */}
            <div className="space-y-1.5 sm:space-y-2 col-span-2">
              <Label htmlFor="season" className="text-xs sm:text-sm">赛季</Label>
              <Input
                id="season"
                value={formData.season}
                onChange={(e) => handleChange('season', e.target.value)}
                placeholder="2025-2026"
                className="h-10 sm:h-11"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5 sm:space-y-2 col-span-2">
              <Label htmlFor="price" className="text-xs sm:text-sm">价格</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                placeholder="输入价格"
                className="h-10 sm:h-11"
                required
              />
            </div>
          </div>

          {/* Actions - Sticky on mobile */}
          <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 sm:pt-4 bg-[#141416] sm:bg-transparent border-t border-white/[0.06] sm:border-t-0 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="h-10 sm:h-11 active:scale-95">
              取消
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-400 h-10 sm:h-11 px-6 active:scale-95">
              {jersey ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Image Lightbox - Outside Dialog to avoid event conflicts */}
      <ImageLightbox
        src={previewImage || ''}
        isOpen={isLightboxOpen}
        onClose={handleLightboxClose}
        alt="球衣预览"
      />
    </Dialog>
  )
}
