'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Skeleton } from '@/components/ui/skeleton'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { baseUrl } from '@/components/api'

const loadMathJax = () => {
  if (typeof window !== 'undefined' && !window.MathJax) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.MathJax = {
        tex: {
          inlineMath: [
            ['$', '$'],
            ['\\(', '\\)'],
          ],
          displayMath: [
            ['$$', '$$'],
            ['\\[', '\\]'],
          ],
        },
        startup: {
          ready: () => {
            window.MathJax.startup.defaultReady()
            window.MathJax.typesetPromise()
          },
        },
      }
    }
  }
}

const TopicDetails = () => {
  const { id } = useParams()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const contentRef = useRef(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${baseUrl}/topic/fetch-single-topic?topicId=${id}`
      )
      setTopic(response.data.topic)
    } catch (error) {
      console.error('Error fetching topic:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  useEffect(() => {
    loadMathJax()
    if (topic && contentRef.current && window.MathJax) {
      window.MathJax.typesetPromise([contentRef.current]).catch((err) =>
        console.error('MathJax typesetting error:', err)
      )
    }
  }, [topic])

  return (
    <DashboardLayout>
      <div className='max-w-4xl mx-auto p-6'>
        {loading ? (
          <Skeleton className='h-40 w-full' />
        ) : topic ? (
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>
                {topic.title}
              </CardTitle>
              <Badge variant='outline' className='text-sm'>
                {topic.subject.name}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>{topic.summary}</p>
              <hr className='my-4' />
              <div ref={contentRef}>
                <ReactMarkdown>{topic.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className='text-red-500 text-center'>
            Failed to load topic details.
          </p>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TopicDetails
