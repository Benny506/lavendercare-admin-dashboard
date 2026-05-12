import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LuRotateCw } from "react-icons/lu";
import { useSelector } from 'react-redux'
import { getSubtleLoaderState } from '../../../../redux/slices/subtleLoaderSlice'

const SubtleLoader = () => {
    const { isRefreshing, message } = useSelector(getSubtleLoaderState)

    return (
        <AnimatePresence>
            {isRefreshing && (
                <motion.div
                    initial={{ y: -50, opacity: 0, x: '-50%' }}
                    animate={{ y: 20, opacity: 1, x: '-50%' }}
                    exit={{ y: -50, opacity: 0, x: '-50%' }}
                    className="fixed top-0 left-1/2 z-[9999] flex items-center gap-3 bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl px-5 py-2.5 rounded-2xl pointer-events-none"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="text-purple-600 flex items-center justify-center"
                    >
                        <LuRotateCw size={18} />
                    </motion.div>
                    <span className="text-sm font-bold text-[#2D1A4A] truncate max-w-[200px]">
                        {message || 'Refreshing...'}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SubtleLoader
