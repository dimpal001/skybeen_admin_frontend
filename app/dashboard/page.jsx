'use client'

import { Card } from '@/components/ui/card'
import DashboardLayout from '@/components/dashboard-layout'
import {
  Users,
  BookOpen,
  FileQuestion,
  CreditCard,
  TrendingUp,
  BarChart3,
  BookText,
} from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import { useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'
import Loading from '@/components/Loading'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/dashboard/get-statistics`)
      setStats(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const recentUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/dashboard/recent-users`)
      setUsers(response.data.users)
    } catch (error) {
      // Empty
    } finally {
      setLoading(false)
    }
  }

  const recentExams = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/dashboard/recent-exams`)
      setExams(response.data.exams)
    } catch (error) {
      // Empty
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
    recentUsers()
    recentExams()
  }, [])

  if (!stats) {
    return <p className='text-center text-gray-500'>Loading statistics...</p>
  }

  const statsData = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: `${stats.userGrowth.toFixed(2)}%`,
      color: stats.userGrowth >= 0 ? 'text-blue-500' : 'text-red-500',
    },
    {
      name: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: CreditCard,
      change: `${stats.subscriptionGrowth.toFixed(2)}%`,
      color: stats.subscriptionGrowth >= 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      name: 'Total Exams',
      value: stats.totalExams,
      icon: FileQuestion,
      change: `${stats.examGrowth.toFixed(2)}%`,
      color: stats.examGrowth >= 0 ? 'text-purple-500' : 'text-red-500',
    },
    {
      name: 'Total Topics',
      value: stats.totalTopics,
      icon: BookText,
      change: `${stats.topicGrowth.toFixed(2)}%`,
      color: stats.topicGrowth >= 0 ? 'text-pink-500' : 'text-red-500',
    },
    {
      name: 'Total Questions',
      value: stats.totalQuestions,
      icon: BookOpen,
      change: `${stats.questionGrowth.toFixed(2)}%`,
      color: stats.questionGrowth >= 0 ? 'text-orange-500' : 'text-red-500',
    },
    {
      name: 'Total Subjects',
      value: stats.totalSubjects,
      icon: BookOpen,
      change: `${stats.questionGrowth.toFixed(2)}%`,
      color: stats.questionGrowth >= 0 ? 'text-orange-500' : 'text-red-500',
    },
  ]

  return (
    <DashboardLayout>
      {loading ? (
        <Loading />
      ) : (
        <div className='space-y-6'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {statsData.map((stat) => (
              <Card key={stat.name} className='dashboard-card'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='dashboard-card-title'>{stat.name}</p>
                    <p className='dashboard-card-value'>{stat.value}</p>
                  </div>
                  <div
                    className={`rounded-full p-2 ${stat.color} bg-opacity-10`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className='flex items-center gap-1 text-sm'>
                  <TrendingUp className='h-4 w-4 text-green-500' />
                  <span className='font-medium text-green-500'>
                    {stat.change}
                  </span>
                  <span className='text-muted-foreground'>from last month</span>
                </div>
              </Card>
            ))}
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <Card className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>Recent Users</h3>
                <BarChart3 className='h-5 w-5 text-muted-foreground' />
              </div>
              <div className='space-y-4'>
                {users.length > 0 &&
                  users.map((user, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between border-b pb-2 last:border-0'
                    >
                      <div>
                        <p className='font-medium'>{user?.fullName}</p>
                        <p className='text-sm text-muted-foreground'>
                          {user?.email}
                        </p>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        <TimeAgo date={user?.createdAt} />
                      </p>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>Recent Exams</h3>
                <FileQuestion className='h-5 w-5 text-muted-foreground' />
              </div>
              <div className='space-y-4'>
                {exams.length > 0 &&
                  exams.map((exam, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between border-b pb-2 last:border-0'
                    >
                      <div>
                        <p className='font-medium'>{exam?.name}</p>
                        <p className='text-sm text-muted-foreground'>
                          {exam?.subject?.name}
                        </p>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        <TimeAgo date={exam?.createdAt} />
                      </p>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
