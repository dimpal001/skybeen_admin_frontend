import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import axios from 'axios'
import { baseUrl } from '@/components/api'

const AddEditPlan = ({ isOpen, setIsOpen, plan = null, refresh }) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [features, setFeatures] = useState('')
  const [isUnlimited, setIsUnlimited] = useState('limited')
  const [examLimit, setExamLimit] = useState('')
  const [questionLimit, setQuestionLimit] = useState('')

  // Populate form when editing
  useEffect(() => {
    if (plan) {
      console.log(plan)
      setName(plan.name || '')
      setPrice(plan.price?.toString() || '')
      setFeatures(Array.isArray(plan.features) ? plan.features.join(', ') : '')
      setIsUnlimited(plan.limit.isUnlimited ? 'unlimited' : 'limited')
      setExamLimit(plan.limit.examCreationLimit?.toString() || '')
      setQuestionLimit(plan.limit.questionCreationLimit?.toString() || '')
    } else {
      setName('')
      setPrice('')
      setFeatures('')
      setIsUnlimited('limited')
      setExamLimit('')
      setQuestionLimit('')
    }
  }, [plan])

  const handleSave = async () => {
    if (!name || !price) return

    const newPlan = {
      id: plan?.id,
      name,
      price: parseFloat(price),
      features: features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      isUnlimited: isUnlimited === 'unlimited',
      examLimit: isUnlimited === 'unlimited' ? null : parseInt(examLimit),
      questionLimit:
        isUnlimited === 'unlimited' ? null : parseInt(questionLimit),
    }

    try {
      if (plan) {
        await axios.patch(`${baseUrl}/plan/update-plan`, {
          id: plan?.id,
          name: newPlan?.name,
          price: newPlan?.price,
          features: newPlan?.features,
          isUnlimited: newPlan?.isUnlimited === 'unlimited' ? true : false,
          examLimit: newPlan?.examLimit,
          questionLimit: newPlan?.questionLimit,
        })
      } else {
        await axios.post(`${baseUrl}/plan/create-plan`, {
          name: newPlan?.name,
          price: newPlan?.price,
          features: newPlan?.features,
          isUnlimited: newPlan?.isUnlimited === 'unlimited' ? true : false,
          examLimit: newPlan?.examLimit,
          questionLimit: newPlan?.questionLimit,
        })
      }

      setIsOpen(false)
      refresh()
    } catch (err) {
      console.error('Error saving plan:', err?.response?.data || err.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit Plan' : 'Add a Plan'}</DialogTitle>
          <DialogDescription>
            {plan
              ? 'Update the subscription plan details.'
              : 'Create a new subscription plan.'}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='plan-name'>Plan Name</Label>
              <Input
                id='plan-name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='plan-price'>Price (₹)</Label>
              <Input
                id='plan-price'
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='plan-features'>Features (comma-separated)</Label>
            <Textarea
              id='plan-features'
              placeholder='feature 1, feature 2, feature 3'
              className='min-h-[120px] font-mono text-sm'
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='plan-unlimited'>Limit Type</Label>
              <Select
                value={isUnlimited}
                onValueChange={(value) => setIsUnlimited(value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select Limit Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='limited'>Limited</SelectItem>
                  <SelectItem value='unlimited'>Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='exam-limit'>Exam Limit</Label>
              <Input
                id='exam-limit'
                type='number'
                value={examLimit}
                disabled={isUnlimited === 'unlimited'}
                onChange={(e) => setExamLimit(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='question-limit'>Question Limit</Label>
              <Input
                id='question-limit'
                type='number'
                value={questionLimit}
                disabled={isUnlimited === 'unlimited'}
                onChange={(e) => setQuestionLimit(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {plan ? 'Save Changes' : 'Add Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditPlan
