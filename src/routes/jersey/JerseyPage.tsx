import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TShirt, ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router'
import JerseyCard from '@/modules/jersey/components/JerseyCard'
import JerseyForm from '@/modules/jersey/components/JerseyForm'
import JerseyFilters from '@/modules/jersey/components/JerseyFilters'
import { useJerseyStore } from '@/modules/jersey/stores/jerseyStore'
import type { JerseyWithImage, JerseyFormData } from '@/modules/jersey/types/jersey'

export default function JerseyPage() {
  const {
    jerseys,
    isLoading,
    error,
    searchQuery,
    sortBy,
    sortOrder,
    fetchJerseys,
    createJersey,
    updateJersey,
    deleteJersey,
    likeJersey,
    uploadImage,
    setSearchQuery,
    setSortBy,
    setSortOrder,
  } = useJerseyStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingJersey, setEditingJersey] = useState<JerseyWithImage | null>(null)

  useEffect(() => {
    fetchJerseys()
  }, [fetchJerseys, searchQuery, sortBy, sortOrder])

  const handleAddClick = useCallback(() => {
    setEditingJersey(null)
    setIsFormOpen(true)
  }, [])

  const handleEditClick = useCallback((jersey: JerseyWithImage) => {
    setEditingJersey(jersey)
    setIsFormOpen(true)
  }, [])

  const handleDeleteClick = useCallback(async (id: number) => {
    if (window.confirm('确定要删除这件球衣吗？')) {
      await deleteJersey(id)
    }
  }, [deleteJersey])

  const handleLikeClick = useCallback(async (id: number) => {
    await likeJersey(id)
  }, [likeJersey])

  const handleFormSubmit = useCallback(async (data: JerseyFormData, imageFile?: File) => {
    if (editingJersey) {
      await updateJersey(editingJersey.id, data)
      if (imageFile) {
        await uploadImage(editingJersey.id, imageFile)
      }
    } else {
      const newJersey = await createJersey(data)
      if (newJersey && imageFile) {
        await uploadImage(newJersey.id, imageFile)
      }
    }
  }, [editingJersey, createJersey, updateJersey, uploadImage])

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false)
    setEditingJersey(null)
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0a0a0b]/95 backdrop-blur-sm border-b border-white/[0.06] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/"
                className="p-2 -ml-2 rounded-lg hover:bg-white/[0.06] transition-colors active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-white/60" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/20">
                  <TShirt weight="fill" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white">球衣管理</h1>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-white/40">
              共 {jerseys.length} 件
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="shrink-0">
        <JerseyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onAddClick={handleAddClick}
        />
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#141416] border border-white/[0.06] overflow-hidden"
              >
                <div className="aspect-[4/3] bg-white/[0.03] shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-white/[0.06] shimmer" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded bg-white/[0.06] shimmer" />
                    <div className="h-5 w-16 rounded bg-white/[0.06] shimmer" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-1/2 rounded bg-white/[0.06] shimmer" />
                    <div className="h-4 w-1/3 rounded bg-white/[0.06] shimmer" />
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                    <div className="h-6 w-20 rounded bg-white/[0.06] shimmer" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded bg-white/[0.06] shimmer" />
                      <div className="h-8 w-8 rounded bg-white/[0.06] shimmer" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchJerseys}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white transition-colors"
            >
              重试
            </button>
          </div>
        ) : jerseys.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.03] mb-6">
              <TShirt className="w-10 h-10 text-white/20" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? '没有找到匹配的球衣' : '还没有球衣'}
            </h2>
            <p className="text-white/60 mb-6">
              {searchQuery
                ? '尝试使用其他关键词搜索'
                : '点击"新增球衣"开始记录你的收藏'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddClick}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-full text-white font-medium transition-colors"
              >
                添加第一件球衣
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {jerseys.map((jersey) => (
                <JerseyCard
                  key={jersey.id}
                  jersey={jersey}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onLike={handleLikeClick}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Form Modal */}
      <JerseyForm
        jersey={editingJersey}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
