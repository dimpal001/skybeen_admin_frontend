'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { baseUrl } from '@/components/api'
import DashboardLayout from '@/components/dashboard-layout'

export default function UserDetailsPage() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/user/get-single-user?id=${id}`
        )
        setUser(response.data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className='p-6'>
          <Skeleton className='h-12 w-1/3 mb-6 rounded-lg' />
          <Skeleton className='h-[500px] w-full rounded-xl' />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className='p-6  min-h-screen'>
        {/* Header Section */}
        <div className='flex items-center space-x-4 mb-8'>
          <Avatar className='h-20 w-20 border-4 border-white shadow-lg'>
            <AvatarFallback className='bg-gradient-to-tr from-blue-500 to-purple-500 text-white text-2xl'>
              {user?.fullName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className='text-3xl font-bold'>
              {user?.fullName || 'Unnamed User'}
            </h1>
            <p className='text-sm text-gray-500'>
              Joined: {new Date(user?.createdAt).toLocaleDateString()}
            </p>
            <Badge
              variant={user?.isActive ? 'success' : 'destructive'}
              className='mt-2'
            >
              {user?.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column: User Info */}
          <Card className='lg:col-span-1 shadow-lg rounded-xl overflow-hidden'>
            <CardHeader className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white'>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className='p-6 space-y-4'>
              <InfoItem label='Phone' value={user?.phoneNumber} />
              <InfoItem label='Class' value={user?.class?.name || 'N/A'} />
              <InfoItem
                label='Referral Code'
                value={user?.referralCode || 'N/A'}
              />
              <InfoItem label='Bonus' value={user?.bonus || 0} />
              <InfoItem label='Bio' value={user?.bio || 'Not provided'} />
              <InfoItem label='Profile URL' value={user?.profileUrl || 'N/A'} />
              <InfoItem
                label='Last Updated'
                value={new Date(user?.updatedAt).toLocaleDateString()}
              />
            </CardContent>
          </Card>

          {/* Right Column: Tabs */}
          <div className='lg:col-span-2 space-y-6'>
            <Tabs defaultValue='overview' className='w-full'>
              <TabsList className='grid grid-cols-2 md:grid-cols-6 gap-2 rounded-lg'>
                <TabsTrigger value='overview' className='rounded-md'>
                  Overview
                </TabsTrigger>
                <TabsTrigger value='subscription' className='rounded-md'>
                  Subscription
                </TabsTrigger>
                <TabsTrigger value='activity' className='rounded-md'>
                  Activity
                </TabsTrigger>
                <TabsTrigger value='subjects' className='rounded-md'>
                  Subjects
                </TabsTrigger>
                <TabsTrigger value='chapters' className='rounded-md'>
                  Chapters
                </TabsTrigger>
                <TabsTrigger value='questions' className='rounded-md'>
                  Questions
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value='overview'>
                <Card className='shadow-lg rounded-xl'>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <StatCard
                      label='Exams Attempted'
                      value={user?.examAttempt?.length || 0}
                    />
                    <StatCard
                      label='Questions Created'
                      value={user?.questions?.length || 0}
                    />
                    <StatCard
                      label='Subjects'
                      value={user?.subjects?.length || 0}
                    />
                    <StatCard
                      label='Chapters'
                      value={user?.chapters?.length || 0}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value='subscription'>
                <Card className='shadow-lg rounded-xl'>
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user?.plan ? (
                      <div className='space-y-4'>
                        <p className='text-lg font-semibold'>
                          {user?.plan?.plan?.name || 'Basic Plan'}
                        </p>
                        <p>
                          <strong>Duration:</strong>{' '}
                          {new Date(user?.plan?.startDate).toLocaleDateString()}{' '}
                          - {new Date(user?.plan?.endDate).toLocaleDateString()}
                        </p>
                        <Badge
                          variant={
                            user?.plan?.isActive ? 'secondary' : 'destructive'
                          }
                        >
                          {user?.plan?.isActive ? 'Active' : 'Expired'}
                        </Badge>
                      </div>
                    ) : (
                      <p>No active subscription.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value='activity'>
                <Card className='shadow-lg rounded-xl'>
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <ActivitySection
                        title='Daily'
                        data={user?.dailyActivity}
                      />
                      <ActivitySection
                        title='Monthly'
                        data={user?.monthlyActivity}
                      />
                      <ActivitySection
                        title='Lifetime'
                        data={user?.lifetimeActivity}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subjects Tab */}
              <TabsContent value='subjects'>
                <Card className='shadow-lg rounded-xl'>
                  <CardHeader>
                    <CardTitle>
                      Subjects ({user?.subjects?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className='h-[300px]'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {user?.subjects?.map((sub) => (
                          <div
                            key={sub.id}
                            className='p-4 rounded-lg shadow-sm'
                          >
                            <p className='font-medium'>{sub?.subject?.name}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chapters Tab */}
              <TabsContent value='chapters'>
                <Card className='shadow-lg rounded-xl'>
                  <CardHeader>
                    <CardTitle>
                      Chapters ({user?.chapters?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className='h-[300px]'>
                      <div className='space-y-4'>
                        {user?.chapters?.map((chapter) => (
                          <div
                            key={chapter.id}
                            className='p-4 rounded-lg shadow-sm'
                          >
                            <p className='font-medium'>{chapter.name}</p>
                            <p className='text-sm text-gray-600'>
                              Subject: {chapter.subjectId} | Created:{' '}
                              {new Date(chapter.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Questions Tab */}
              <TabsContent value='questions'>
                <Card className='shadow-lg rounded-xl'>
                  <CardHeader>
                    <CardTitle>
                      Questions ({user?.questions?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className='h-[300px]'>
                      <div className='space-y-4'>
                        {user?.questions?.map((question) => (
                          <div
                            key={question.id}
                            className='p-4 rounded-lg shadow-sm'
                          >
                            <p className='font-medium'>{question.content}</p>
                            <p className='text-sm text-gray-600'>
                              Created:{' '}
                              {new Date(
                                question.createdAt
                              ).toLocaleDateString()}{' '}
                              | Subject: {question.subjectId || 'N/A'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper Components
const InfoItem = ({ label, value }) => (
  <div className='flex justify-between border-b py-2'>
    <span className='font-semibold '>{label}:</span>
    <span className=''>{value}</span>
  </div>
)

const StatCard = ({ label, value }) => (
  <div className='p-4 rounded-lg bg-muted shadow-md text-center'>
    <p className='text-2xl font-bold text-indigo-600'>{value}</p>
    <p className='text-sm text-gray-500'>{label}</p>
  </div>
)

const ActivitySection = ({ title, data }) => (
  <div>
    <h3 className='font-semibold '>{title}</h3>
    <pre className='p-4 rounded-md text-sm '>
      {JSON.stringify(data, null, 2) || 'No data available'}
    </pre>
  </div>
)
