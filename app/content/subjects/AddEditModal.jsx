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

const AddEditModal = ({ isOpen, setOpen, subject, refreshSubjects }) => {
  const [subjectName, setSubjectName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (subject) {
      setSubjectName(subject.name)
    } else {
      setSubjectName('')
    }
  }, [subject])

  const handleSubmit = async () => {
    if (!subjectName.trim()) return
    setLoading(true)
    try {
      if (subject) {
        await axios.patch(`${baseUrl}/subject/update-subject`, {
          name: subjectName,
          id: subject.id,
        })
      } else {
        await axios.post(`${baseUrl}/subject/add-subject`, {
          name: subjectName,
        })
      }
      refreshSubjects()
      setOpen(false)
    } catch (error) {
      console.error('Error saving subject:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {subject ? 'Edit Subject' : 'Add New Subject'}
          </DialogTitle>
          <DialogDescription>
            {subject
              ? 'Update the subject details.'
              : 'Add a new subject to the system.'}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Subject Name</Label>
            <Input
              id='name'
              placeholder='Enter subject name'
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
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
            {loading ? 'Saving...' : subject ? 'Update Subject' : 'Add Subject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditModal
