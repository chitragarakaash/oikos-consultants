'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    const winScroll = document.documentElement.scrollTop
    if (winScroll > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Back to top"
          className="fixed bottom-8 right-8 z-50 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Button Content */}
          <div className="relative w-12 h-12 bg-[#2E7D32] rounded-full flex items-center justify-center
                        shadow-lg group-hover:shadow-xl transition-all duration-300 
                        group-hover:bg-[#1B5E20] border-2 border-white/90">
            {/* Inner shadow overlay */}
            <div className="absolute inset-0 rounded-full shadow-inner-white opacity-50" />
            
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <ArrowUp strokeWidth={3} className="w-6 h-6 text-white" />
            </motion.div>
            
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </div>

          {/* Tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#2E7D32] text-white text-sm 
                        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap
                        border border-white/90">
            Back to top
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2E7D32] rotate-45 border-b border-r border-white/90" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// Add this to your global CSS file (globals.css)
// .shadow-inner-white {
//   box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.2);
// } 