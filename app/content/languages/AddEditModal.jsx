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

const AddEditModal = ({ isOpen, setOpen, language, refresh }) => {
  const [languageName, setLanguageName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (language) {
      setLanguageName(language.name)
    } else {
      setLanguageName('')
    }
  }, [language])

  const handleSubmit = async () => {
    if (!languageName.trim()) return
    setLoading(true)
    try {
      if (language) {
        await axios.patch(`${baseUrl}/language/update-language`, {
          name: languageName,
          id: language.id,
        })
      } else {
        await axios.post(`${baseUrl}/language/add-language`, {
          name: languageName,
        })
      }
      refresh()
      setOpen(false)
    } catch (error) {
      console.error('Error saving language:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {language ? 'Edit Language' : 'Add New Language'}
          </DialogTitle>
          <DialogDescription>
            {language
              ? 'Update the language details.'
              : 'Add a new language to the system.'}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Language Name</Label>
            <Input
              id='name'
              placeholder='Enter language name'
              value={languageName}
              onChange={(e) => setLanguageName(e.target.value)}
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
            {loading
              ? 'Saving...'
              : language
              ? 'Update Language'
              : 'Add Language'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditModal
