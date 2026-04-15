import { useState, useCallback, memo } from 'react'
import { MagnifyingGlass, Plus, Funnel, Heart, Calendar, CurrencyDollar, CaretUp, CaretDown } from '@phosphor-icons/react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'

interface JerseyFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: 'createdAt' | 'likes' | 'price'
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: 'createdAt' | 'likes' | 'price') => void
  onSortOrderChange: (order: 'asc' | 'desc') => void
  onAddClick: () => void
}

export default memo(function JerseyFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  onAddClick,
}: JerseyFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearch)
  }, [localSearch, onSearchChange])

  const handleSortClick = useCallback((newSortBy: 'createdAt' | 'likes' | 'price') => {
    if (sortBy === newSortBy) {
      onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      onSortChange(newSortBy)
      onSortOrderChange('desc')
    }
  }, [sortBy, sortOrder, onSortChange, onSortOrderChange])

  const sortButtons = [
    { key: 'createdAt' as const, label: '时间', icon: Calendar },
    { key: 'likes' as const, label: '热门', icon: Heart },
    { key: 'price' as const, label: '价格', icon: CurrencyDollar },
  ]

  return (
    <div className="bg-[#0a0a0b]/95 backdrop-blur-sm border-b border-white/[0.06] py-3 sm:py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Mobile: Stack layout, Desktop: Row layout */}
      <div className="flex flex-col gap-3">
        {/* Top row: Search + Add button (mobile: full width) */}
        <div className="flex gap-2 sm:gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
              <Input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="搜索球衣..."
                className="pl-9 sm:pl-10 pr-4 h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
          </form>

          {/* Mobile: Add button as icon only */}
          <Button
            onClick={onAddClick}
            className="bg-blue-500 hover:bg-blue-400 h-10 sm:h-11 w-10 sm:w-auto px-0 sm:px-4 shrink-0 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline ml-2">新增球衣</span>
          </Button>
        </div>

        {/* Bottom row: Sort buttons (mobile: scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 -mx-1 px-1 sm:mx-0 sm:px-0">
          <span className="text-xs text-white/40 shrink-0 hidden sm:inline">
            <Funnel className="w-4 h-4" />
          </span>
          {sortButtons.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={sortBy === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortClick(key)}
              className={cn(
                'gap-1.5 h-8 sm:h-9 px-3 text-xs sm:text-sm shrink-0 active:scale-95',
                sortBy === key && 'bg-blue-500 hover:bg-blue-400'
              )}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{label}</span>
              {sortBy === key && (
                <span className="flex items-center">
                  {sortOrder === 'asc' ? (
                    <CaretUp className="w-3 h-3" />
                  ) : (
                    <CaretDown className="w-3 h-3" />
                  )}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
})