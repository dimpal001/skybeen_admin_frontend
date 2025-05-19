'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash, CheckCircle, Plus, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import AddEditPlan from './AddEditPlan'
import DeleteModal from '@/components/DeleteComponent'
import Loading from '@/components/Loading'

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(false)
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    setShowDeleteModal(false)
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/plan/get-all-plans`)
      setPlans(response.data.plans)
    } catch {
      // Empty
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DashboardLayout>
      <div className='space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold'>Subscription Plans</h1>
            <p className='text-muted-foreground'>
              Choose the perfect plan for your learning needs
            </p>
          </div>
          <Button
            size='sm'
            onClick={() => {
              setSelectedItem(null)
              setShowAddEditModal(true)
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add New Plan
          </Button>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2'>
            {plans.length > 0 &&
              plans.map((plan) => (
                <Card key={plan.id} className='flex flex-col relative'>
                  <CardHeader className='pb-3'>
                    {/* More Icon Top Right */}
                    <div className='absolute top-2 right-2'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <span className='sr-only'>Actions</span>
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(plan)
                              setShowAddEditModal(true)
                            }}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(plan)
                              setShowDeleteModal(true)
                            }}
                          >
                            <Trash className='mr-2 h-4 w-4' />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <CardTitle className='text-xl'>{plan.name}</CardTitle>
                    <div className='text-3xl font-bold mt-2'>
                      ₹{plan.price}
                      <span className='text-sm font-normal text-muted-foreground'>
                        /month
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className='flex-1 flex flex-col justify-between'>
                    {/* Features List */}
                    <ul className='space-y-3 mb-4'>
                      {plan.features.map((feature, index) => (
                        <li key={index} className='flex items-start gap-3'>
                          <CheckCircle className='h-5 w-5 min-w-[20px] text-green-500 mt-0.5' />
                          <span className='text-sm leading-snug'>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Limit Section */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground border-t pt-3 mt-auto'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-foreground'>
                          Exam Limit:
                        </span>
                        <span>
                          {plan.limit.isUnlimited
                            ? 'Unlimited'
                            : plan.limit.examCreationLimit}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-foreground'>
                          Question Limit:
                        </span>
                        <span>
                          {plan.limit.isUnlimited
                            ? 'Unlimited'
                            : plan.limit.questionCreationLimit}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>

      <AddEditPlan
        isOpen={showAddEditModal}
        setIsOpen={setShowAddEditModal}
        plan={selectedItem}
        refresh={fetchData}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        setOpen={setShowDeleteModal}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}
