'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Plus, MoreHorizontal, Edit, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AddEditModal from './AddEditModal'
import DeleteModal from '../../../components/DeleteComponent'
import axios from 'axios'
import { baseUrl } from '@/components/api'

export default function LanguagePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddLanguageOpen, setIsAddLanguageOpen] = useState(false)
  const [languages, setLanguages] = useState([])
  const [loadingLanguage, setLoadingLanguage] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchLanguages = async () => {
    try {
      setLoadingLanguage(true)
      const response = await axios.get(
        `${baseUrl}/language/get-all-languages`,
        {
          params: {
            search: searchQuery || undefined,
          },
        }
      )
      setLanguages(response.data.languages)
    } catch (error) {
      console.error('Error fetching languages:', error)
    } finally {
      setLoadingLanguage(false)
    }
  }

  const handleDeleteSubject = async () => {
    try {
      setIsDeleting(true)
      await axios.delete(
        `${baseUrl}/subject/delete-subject?id=${selectedItem.id}`
      )
      setShowDeleteModal(false)
      setSelectedItem(null)
      fetchLanguages()
    } catch (error) {
      console.error('Error fetching languages:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [searchQuery])

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative w-full sm:w-96'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search languages...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(0)
              }}
            />
          </div>
          <Button
            size='sm'
            onClick={() => {
              setSelectedItem(null)
              setIsAddLanguageOpen(true)
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Subject
          </Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sl No.</TableHead>
                <TableHead>Language Name</TableHead>
                <TableHead>Topics</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead className='w-[80px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingLanguage ? (
                <TableRow>
                  <TableCell colSpan={4} className='h-24 text-center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : languages.length > 0 ? (
                languages.map((subject, index) => (
                  <TableRow key={subject.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {subject.name}
                    </TableCell>
                    <TableCell>{subject?._count?.topics || 0}</TableCell>
                    <TableCell>{subject?._count?.exams || 0}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(subject)
                              setIsAddLanguageOpen(true)
                            }}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(subject)
                              setShowDeleteModal(true)
                            }}
                          >
                            <Trash className='mr-2 h-4 w-4' />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className='h-24 text-center'>
                    No languages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddEditModal
        isOpen={isAddLanguageOpen}
        setOpen={setIsAddLanguageOpen}
        language={selectedItem}
        refresh={fetchLanguages}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        setOpen={setShowDeleteModal}
        onDelete={handleDeleteSubject}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  )
}
