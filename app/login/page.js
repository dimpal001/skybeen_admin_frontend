'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, BookOpen, Loader2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { baseUrl } from '../../components/api'

export default function LoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        { phoneNumber, password },
        { withCredentials: true }
      )
      if (response.status === 200) {
        localStorage.setItem('isAuthenticated', 'true')
        router.push('/dashboard')
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className='flex h-screen w-full  text-white overflow-hidden'>
      {/* Decorative glowing spheres */}
      <motion.div
        className='absolute w-96 h-96 bg-purple-500 opacity-30 rounded-full blur-3xl top-10 left-10'
        animate={{ x: [0, 50, -30, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <motion.div
        className='absolute w-80 h-80 bg-cyan-400 opacity-20 rounded-full blur-3xl bottom-10 right-20'
        animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className='relative z-10 flex flex-col md:flex-row w-full h-full'>
        {/* Left side info panel */}
        <div className='hidden md:flex flex-col justify-center items-center w-1/2 px-16 bg-transparent'>
          <motion.div
            className='text-center max-w-md'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className='h-10 w-10 text-purple-400 mb-4 animate-pulse' />
            <h1 className='text-4xl font-bold mb-4'>Welcome Back, Commander</h1>
            <p className='text-lg text-white/70'>
              Your digital command center awaits. Log in to orchestrate your
              learning universe.
            </p>
          </motion.div>
        </div>

        {/* Login form panel */}
        <div className='flex justify-center items-center w-full md:w-1/2 p-6 sm:p-12'>
          <motion.div
            className='w-full max-w-md bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 shadow-xl'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className='mb-6 text-center'>
              <BookOpen className='h-8 w-8 text-primary mx-auto mb-2' />
              <h2 className='text-2xl font-semibold'>Admin Portal Login</h2>
              <p className='text-sm text-white/60'>
                Secure access to manage the platform
              </p>
            </div>

            {error && (
              <motion.div
                className='mb-4 p-3 text-sm rounded-md bg-red-600/20 text-red-400'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='phoneNumber'>Username / Phone</Label>
                <Input
                  id='phoneNumber'
                  placeholder='john_doe or 9876543210'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className='bg-black/20 border border-white/10 text-white placeholder:text-white/40'
                />
              </div>

              <div>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Your secret password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='bg-black/20 border border-white/10 text-white placeholder:text-white/40'
                />
              </div>

              <Button
                type='submit'
                className='w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' /> Logging in...
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <Lock className='h-4 w-4' /> Access Portal
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
