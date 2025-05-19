'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

const Loading = () => {
  return (
    <div className='w-full h-[300px] flex items-center justify-center bg-background text-foreground'>
      <motion.div
        className='flex flex-col items-center gap-4'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className='relative w-8 h-8'>
          <LoaderCircle className='animate-spin text-primary w-full h-full' />
        </div>
        <p className='text-sm font-medium text-muted-foreground'>
          Loading, please wait...
        </p>
      </motion.div>
    </div>
  )
}

export default Loading
