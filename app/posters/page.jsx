'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/dashboard-layout'
import { PlusIcon } from 'lucide-react'
import { baseUrl } from '@/components/api'

export default function PosterPage() {
  const [file, setFile] = useState(null)
  const [posters, setPosters] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchPosters = async () => {
    try {
      const res = await axios.get(`${baseUrl}/posters`)
      setPosters(res.data.posters)
    } catch (err) {
      console.error('Error fetching posters', err)
    }
  }

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first')

    const formData = new FormData()
    formData.append('image', file)

    try {
      setLoading(true)
      const res = await axios.post(`${baseUrl}/posters`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setFile(null)
      fetchPosters()
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosters()
  }, [])

  return (
    <DashboardLayout>
      <div className='max-w-2xl mx-auto p-4 space-y-6'>
        <h1 className='text-2xl font-semibold'>Poster Upload</h1>

        <div className='border p-4 rounded-lg space-y-3'>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
            className='w-full'
          />
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? (
              'Uploading...'
            ) : (
              <>
                <PlusIcon className='mr-1' /> Upload
              </>
            )}
          </Button>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {posters.map((poster) => (
            <div
              key={poster.id}
              className='border rounded-md overflow-hidden shadow-sm'
            >
              <img
                src={poster.url}
                alt='Poster'
                className='w-full h-48 object-cover'
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
