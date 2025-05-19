import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import ToastBox from '@/components/ToastBox'

const AddEditModal = ({ isOpen, setIsOpen }) => {
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastData, setToastData] = useState(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${baseUrl}/subject/get-subjects`)
        setSubjects(response.data.subjects)
      } catch (error) {
        setToastData({ data: 'Error fetching subjects', variant: 'error' })
        setIsOpen(false)
      }
    }
    if (isOpen) fetchSubjects()
  }, [isOpen])

  const handleCreate = async () => {
    if (!selectedSubject || !content.trim()) {
      setToastData({ data: 'Please fill all fields', variant: 'warning' })
      return
    }

    try {
      setLoading(true)
      await axios.post(`${baseUrl}/topic/create-topic`, {
        subjectId: selectedSubject,
        content,
      })

      setToastData({ data: 'Topic created successfully!', variant: 'success' })
      setIsOpen(false)
    } catch (error) {
      setToastData({ data: 'Failed to create topic', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
            <DialogDescription>
              Create a new educational topic. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {toastData && (
              <ToastBox
                data={toastData.data}
                variant={toastData.variant}
                onClose={() => setToastData(null)}
              />
            )}
            <div className='grid gap-2'>
              <Label htmlFor='subject'>Subject</Label>
              <Select onValueChange={setSelectedSubject}>
                <SelectTrigger id='subject'>
                  <SelectValue placeholder='Select subject' />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject?.id} value={subject?.id}>
                      {subject?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='content'>Content (Markdown format)</Label>
              <Textarea
                id='content'
                placeholder='# Introduction\nThis is the introduction to the topic...\n\n## Main Concepts\nThe main concepts of this topic are...'
                className='min-h-[150px] font-mono text-sm'
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' onClick={handleCreate} disabled={loading}>
              {loading ? 'Creating...' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddEditModal
