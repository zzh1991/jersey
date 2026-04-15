import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { TShirt, Heart, MagnifyingGlass, Plus, ArrowRight } from '@phosphor-icons/react'

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] flex flex-col">
      {/* Hero Section - Asymmetric Layout */}
      <section className="flex-1 flex items-center px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-0">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 sm:mb-6">
              <TShirt weight="fill" className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm text-blue-400 font-medium">收藏管理工具</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-none mb-3 sm:mb-4">
              球衣管理
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-md mb-6 sm:mb-8 leading-relaxed">
              记录你的球衣收藏，管理每一件珍贵的回忆。
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link
                to="/jersey"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-full transition-all duration-300 hover:gap-4 group active:scale-95"
              >
                <span>进入管理</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Feature Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {[
              { icon: Plus, label: '新增球衣', desc: '快速添加', color: 'blue' },
              { icon: MagnifyingGlass, label: '搜索筛选', desc: '精准查找', color: 'emerald' },
              { icon: Heart, label: '热门排序', desc: '点赞排行', color: 'rose' },
              { icon: TShirt, label: '图片管理', desc: '上传展示', color: 'amber' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#141416] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 active:scale-[0.98]"
              >
                <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl mb-3 sm:mb-4 ${
                  item.color === 'blue' ? 'bg-blue-500/20' :
                  item.color === 'emerald' ? 'bg-emerald-500/20' :
                  item.color === 'rose' ? 'bg-rose-500/20' :
                  'bg-amber-500/20'
                }`}>
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    item.color === 'blue' ? 'text-blue-400' :
                    item.color === 'emerald' ? 'text-emerald-400' :
                    item.color === 'rose' ? 'text-rose-400' :
                    'text-amber-400'
                  }`} />
                </div>
                <div className="text-sm sm:text-base font-semibold text-white mb-0.5 sm:mb-1">{item.label}</div>
                <div className="text-xs sm:text-sm text-white/40">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 sm:py-6 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-white/[0.06] shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm text-white/40">
          <span>球衣收藏管理系统</span>
          <span className="hidden sm:inline">Powered by zzhpro</span>
        </div>
      </footer>
    </div>
  )
}