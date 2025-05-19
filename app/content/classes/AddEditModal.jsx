import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { baseUrl } from '@/components/api'

const AddEditModal = ({ isOpen, setOpen, classData, refresh }) => {
  const [className, setClassName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (classData) {
      setClassName(classData.name)
    } else {
      setClassName('')
    }
  }, [classData])

  const handleSubmit = async () => {
    if (!className.trim()) return
    setLoading(true)
    try {
      if (classData) {
        await axios.patch(`${baseUrl}/class/update-class`, {
          name: className,
          id: classData.id,
        })
      } else {
        await axios.post(`${baseUrl}/class/create-class`, {
          name: className,
        })
      }
      refresh()
      setOpen(false)
    } catch (error) {
      console.error('Error saving class:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {classData ? 'Edit Class' : 'Add New Class'}
          </DialogTitle>
          <DialogDescription>
            {classData
              ? 'Update the class details.'
              : 'Add a new class to the system.'}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Class Name</Label>
            <Input
              id='name'
              placeholder='Enter class name'
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type='button' onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : classData ? 'Update Class' : 'Add Class'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditModal
